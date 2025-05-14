import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve, ServerType } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { Root } from './root.js';
import { NODE_ENV, PORT } from './config.js';
import { subscriptionRouter } from './routers/subscription.router.js';
import { disconnectFromDb, runMigrations } from './db.js';
import { createLogger } from './libs/pino.lib.js';
import { setupSubscriptions, startScheduler, stopScheduler } from './services/scheduler.service.js';
import { onGracefulShutdown } from './utils/graceful-shutdown.utils.js';

const app = new OpenAPIHono();

const logger = createLogger('server');

app.use(secureHeaders());

app.onError((err, c) => {
  const message = err instanceof HTTPException ? err.message : 'internal server error';
  const statusCode = err instanceof HTTPException ? err.status : 500;

  return c.json({ message }, statusCode);
});

// if you specify the 200 schema as a string, you cannot be able to use c.html because of type issues
app.openapi(
  createRoute({ method: 'get', path: '/', responses: { 200: { description: 'the root page' } } }),
  async (c) => await c.html(<Root />),
);

app.openAPIRegistry.registerComponent('securitySchemes', 'bearer', {
  type: 'http',
  scheme: 'bearer',
})

app.doc('/swagger.json', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'weather subscription',
  },
});
app.get('/swagger', swaggerUI({ url: '/swagger.json' }));

app.route('/api', subscriptionRouter);

app.get('*', serveStatic({ root: './public' }));

const TIME_TO_CLOSE_BEFORE_EXIT_IN_MS = 15_000;

const setupGracefulShutdown = (server: ServerType) => {
  const gracefulShutdown = async () => {
    await new Promise((res, rej) => {
      server.close((err) => !err ? res(null) : rej(err));
    });

    await disconnectFromDb();
    await stopScheduler();
  };
  onGracefulShutdown(gracefulShutdown);

  const handleError = (errorName: string) => async (cause: unknown) => {
    logger.error({ err: new Error(errorName, { cause }) });

    const timeout = setTimeout(() => {
      logger.error(new Error('Graceful shutdown has been failed', { cause }));

      process.exit(1);
    }, TIME_TO_CLOSE_BEFORE_EXIT_IN_MS);

    await gracefulShutdown();
    clearTimeout(timeout);

    process.exit(1);
  };
  process.on('unhandledRejection', handleError('app has received unhandledRejection'));
  process.on('uncaughtException', handleError('app has received uncaughtException'));
}

const server = serve({ fetch: app.fetch, port: PORT }, async (info) => {
  await runMigrations();
  await startScheduler();

  await setupSubscriptions();

  setupGracefulShutdown(server);

  const parts = ['Server has been started'];

  if (NODE_ENV === 'development') {
    parts.push(`at http://localhost:${info.port}`);
  };

  logger.info({
    msg: parts.join(' '),
    NODE_ENV,
  });
});
