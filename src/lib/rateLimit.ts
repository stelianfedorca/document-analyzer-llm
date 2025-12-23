import { db } from "./firebaseAdmin";
import { Timestamp, FieldValue } from "firebase-admin/firestore";

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS = 3;

interface RateLimitData {
  requestCount: number;
  windowStart: Timestamp;
}

export async function checkRateLimit(userId: string) {
  const userRateLimitRef = db.collection("rateLimits").doc(userId);

  return await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRateLimitRef);
    const now = Date.now();
    const nowTimestamp = Timestamp.fromMillis(now);

    if (!doc.exists) {
      // First request ever
      const newData: RateLimitData = {
        requestCount: 1,
        windowStart: nowTimestamp,
      };
      transaction.set(userRateLimitRef, newData);
      return {
        allowed: true,
        remaining: MAX_REQUESTS - 1,
        resetAt: new Date(now + RATE_LIMIT_WINDOW_MS),
      };
    }

    const data = doc.data() as RateLimitData;
    const windowStartMs = data.windowStart.toMillis();
    const isWindowExpired = now - windowStartMs > RATE_LIMIT_WINDOW_MS;

    if (isWindowExpired) {
      // Reset window
      const newData: RateLimitData = {
        requestCount: 1,
        windowStart: nowTimestamp,
      };
      transaction.set(userRateLimitRef, newData);
      return {
        allowed: true,
        remaining: MAX_REQUESTS - 1,
        resetAt: new Date(now + RATE_LIMIT_WINDOW_MS),
      };
    }

    if (data.requestCount >= MAX_REQUESTS) {
      // Limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetAt: new Date(windowStartMs + RATE_LIMIT_WINDOW_MS),
      };
    }

    // Increment count within current window
    const newCount = data.requestCount + 1;
    transaction.update(userRateLimitRef, {
      requestCount: newCount,
    });

    return {
      allowed: true,
      remaining: MAX_REQUESTS - newCount,
      resetAt: new Date(windowStartMs + RATE_LIMIT_WINDOW_MS),
    };
  });
}
