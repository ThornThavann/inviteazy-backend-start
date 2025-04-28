import { logger } from "../../services/loggerService";
import { Firestore } from "firebase-admin/firestore";

export async function firestoreWithLogging<T>(
  db: Firestore,
  action: () => Promise<T>,
  description: string,
  requestId?: string
): Promise<T> {
  const startTime = Date.now();
  try {
    const result = await action();
    const duration = Date.now() - startTime;
    logger.info("Firestore action executed", {
      requestId,
      description,
      duration: `${duration}ms`,
    });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    if (error instanceof Error) {
      logger.error("Firestore action failed", {
        requestId,
        description,
        error: error.message,
        duration: `${duration}ms`,
      });
    }
    throw error;
  }
}
