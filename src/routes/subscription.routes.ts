import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import { subscribe, confirm, unsubscribe } from 'src/services/subscription.service.js';
import { Frequency } from 'src/db.schema.js';
import { Exception, ExceptionCode } from 'src/exception.js';

const app = new OpenAPIHono();

const subscribeSchema = z.object({
  email: z.string().email(),
  city: z.string().min(1),
  frequency: z.enum([Frequency.Hourly, Frequency.Daily]),
});

app.openapi(
  createRoute({
    method: 'post',
    path: '/subscribe',
    request: {
      body: {
        content: {
          'application/json': {
            schema: subscribeSchema,
          },
          'application/x-www-form-urlencoded': {
            schema: subscribeSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Subscription initiated',
      },
      400: {
        description: 'Invalid input',
      },
      409: {
        description: 'Email already subscribed',
      },
      500: {
        description: 'Internal server error',
      },
    },
  }),
  async (c) => {
    // we have this function here, to preserve type safety
    const getSubscribeBody = () => {
      const contentType = c.req.header('content-type') || '';

      if (contentType.includes('application/json')) {
        return c.req.valid('json');
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        return c.req.valid('form');
      } else {
        throw new Exception(ExceptionCode.VALIDATION_ERROR, 'Unsupported content type');
      }
    };

    const options = getSubscribeBody();
    await subscribe(options);

    return c.json({ message: 'Subscription initiated' }, 200);
  },
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/confirm/{token}',
    request: {
      params: z.object({
        token: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Subscription confirmed successfully',
      },
      400: {
        description: 'Invalid token',
      },
    },
  }),
  async (c) => {
    const { token } = c.req.param();

    await confirm(token);

    return c.json({ message: 'Subscription confirmed successfully' }, 200);
  },
);

app.openapi(
  createRoute({
    method: 'get',
    path: '/unsubscribe/{token}',
    request: {
      params: z.object({
        token: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Unsubscribed successfully',
      },
      400: {
        description: 'Invalid token',
      },
    },
  }),
  async (c) => {
    const { token } = c.req.param();

    await unsubscribe(token);

    return c.json({ message: 'Unsubscribed successfully' }, 200);
  },
);

export const subscriptionRouter = app;
