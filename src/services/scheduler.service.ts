import PgBoss from 'pg-boss';
import { POSTGRES_URL } from 'src/config.js';
import { handleWeatherSubscription } from './subscription.service.js';
import { Frequency } from 'src/db.schema.js';

const boss = new PgBoss(POSTGRES_URL);

export const startScheduler = async () => {
  await boss.start();
};

export const stopScheduler = async () => {
  await boss.stop();
};

type SetupSubscriptionOptions = {
  name: string;
  cron: string;
  handler: (job?: PgBoss.Job<unknown>) => Promise<void> | void;
};

const setupSubscription = async ({ name, cron, handler }: SetupSubscriptionOptions) => {
  await boss.createQueue(name);
  await boss.schedule(name, cron);

  await boss.work(name, {}, async ([job]) => {
    await handler(job);
  });
};

const enum Cron {
  DAILY = '0 0 * * *',
  HOURLY = '0 * * * *',
}

export const setupSubscriptions = async () => {
  await setupSubscription({
    name: 'daily-weather-subscription',
    cron: Cron.DAILY,
    handler: handleWeatherSubscription(Frequency.Daily),
  });
  await setupSubscription({
    name: 'hourly-weather-subscription',
    cron: Cron.HOURLY,
    handler: handleWeatherSubscription(Frequency.Hourly),
  });
};
