import { eq } from 'drizzle-orm';
import { db } from 'src/db.js';
import { Frequency, subscriptions } from 'src/db.schema.js';

export const createSubscription = async (data: typeof subscriptions.$inferInsert) => {
  return await db.insert(subscriptions).values(data).returning();
};

export const isSubscriptionExists = async (email: string) => {
  const result = await db.select().from(subscriptions).where(eq(subscriptions.email, email)).limit(1).execute();

  return result.length > 0;
};

export const removeSubscriptionById = async (id: string) => {
  return await db.delete(subscriptions).where(eq(subscriptions.id, id)).returning();
};

export async function* iterateSubscriptions(frequency: Frequency, limit = 50) {
  let offset = 0;

  while (true) {
    const subscriptionsBatch = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.frequency, frequency))
      .limit(limit)
      .offset(offset)
      .execute();

    if (subscriptionsBatch.length === 0) {
      break;
    }

    yield subscriptionsBatch;

    if (subscriptionsBatch.length < limit) {
      break;
    }

    offset += limit;
  }
}
