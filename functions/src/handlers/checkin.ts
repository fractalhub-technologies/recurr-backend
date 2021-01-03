import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { error, getUidOrThrowError, success } from "../utils/handler";
import { throwErrorIfRecurIsNotOwnedByUser } from "../domain/recur";
const db = admin.firestore();

export const checkIn = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);
  const { recurId } = data;

  await throwErrorIfRecurIsNotOwnedByUser(recurId, uid);

  try {
    const d = new Date();
    const datestamp = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const ref = `recurs/${recurId}/checkins/${uid}_${datestamp}`;
    await db.doc(ref).set({
      uid,
      date: new Date().toISOString(),
    });
    return success();
  } catch (error) {
    logger.error("Error while checking in", error);
    throw new https.HttpsError("internal", "Internal Server Error");
  }
});
