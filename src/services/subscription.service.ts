import { Frequency } from 'src/db.schema.js';
import { sign, verify } from './jwt.service.js';
import {
  createSubscription,
  isSubscriptionExists,
  removeSubscriptionById,
} from 'src/repositories/subscription.repository.js';
import { APP_URL } from 'src/config.js';
import { Exception, ExceptionCode } from 'src/exception.js';
import { createLogger } from 'src/libs/pino.lib.js';

const logger = createLogger('subscription.service');

export type SubscribeOptions = {
  email: string;
  city: string;
  frequency: Frequency;
};

const checkIsSubscriptionExists = async (email: string, city: string) => {
  if (await isSubscriptionExists(email, city)) {
    throw new Exception(ExceptionCode.ALREADY_EXISTS, 'Subscription already exists');
  }
};

export const subscribe = async (options: SubscribeOptions) => {
  await checkIsSubscriptionExists(options.email, options.city);

  const token = await sign(options);
  const confirmationLink = `${APP_URL}/api/confirm/${token}`;

  // TODO: send email with confirmation link
  logger.info({ confirmationLink });
};

export const confirm = async (token: string) => {
  const options = await verify<SubscribeOptions>(token);

  await checkIsSubscriptionExists(options.email, options.city);

  await createSubscription(options);
};

export type UnsubscribeOptions = {
  subscriptionId: string;
};

export const getUnsubscribeToken = async (options: UnsubscribeOptions) => {
  return await sign(options);
};

export const unsubscribe = async (token: string) => {
  const { subscriptionId } = await verify<UnsubscribeOptions>(token);

  await removeSubscriptionById(subscriptionId);
};
