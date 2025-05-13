import { and, eq } from 'drizzle-orm';
import { db } from 'src/db.js';
import { subscriptions } from 'src/db.schema.js';

export const createSubscription = async (data: typeof subscriptions.$inferInsert) => {
  return await db.insert(subscriptions).values(data).returning();
};

export const isSubscriptionExists = async (email: string, city: string) => {
  const result = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.email, email), eq(subscriptions.city, city)))
    .limit(1)
    .execute();

  return result.length > 0;
};

export const removeSubscriptionById = async (id: string) => {
  return await db.delete(subscriptions).where(eq(subscriptions.id, id)).returning();
};
