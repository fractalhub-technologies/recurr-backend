import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { getUidOrThrowError, success } from "../utils/handler";

const db = admin.firestore();

export const dispatch = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);

  logger.info("Got data length: ", data.length, " | User: ", uid);

  if (data.length > 0) {
    logger.debug("Received data", data);

    await db.doc(`users/${uid}`).update({
      commits: data,
    });
  }

  return success();
});
