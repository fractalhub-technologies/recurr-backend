import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { getUidOrThrowError, success } from "../utils/handler";
import { Commit } from "../types/recur";

const db = admin.firestore();

export const pushCommits = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);

  logger.info("Got data length: ", data.length, " | User: ", uid);

  if (data.length > 0) {
    logger.debug("Received data", data);

    data.forEach(async (commit: Commit) => {
      try {
        await db.collection(`users/${uid}/commits`).add(commit);
      } catch (err) {
        logger.error("Error while inserting commits ", err);
      }
    });
  }

  return success();
});

export const fetchCommits = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);
  const head = data.head;
  logger.info(`FETCH uid = ${uid} | head = ${head}`);

  const commits = db.collection(`users/${uid}/commits`);
  let docs;

  if (!head || head === null) {
    docs = await (await commits.get()).docs;
  } else {
    docs = await (await commits.where("head", ">", head).get()).docs;
  }

  return docs;
});