import { secureHeaders } from 'hono/secure-headers';
import { HTTPException } from 'hono/http-exception';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { Root } from './root.jsx';
import { NODE_ENV, PORT } from './config.js';
import { subscriptionRouter } from './routers/subscription.router.js';
import { runMigrations } from './db.js';
import { createLogger } from './libs/pino.lib.js';

const app = new OpenAPIHono();

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

const logger = createLogger('server');

serve({ fetch: app.fetch, port: PORT }, async (info) => {
  await runMigrations();

  const parts = ['Server has been started'];

  if (NODE_ENV === 'development') {
    parts.push(`at http://localhost:${info.port}`);
  }

  logger.info(parts.join(' '), {
    NODE_ENV,
  })
});
