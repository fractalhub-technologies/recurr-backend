import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { CreateRecurParams, CreateRecurResponse } from "../src/types/recur";

admin.initializeApp({ projectId: "fractalhub-612ee" });

export const helloWorld = https.onRequest((req, res) => {
  logger.info("Hello world from Firebase TS", {
    structuredData: true,
  });
  res.status(200).send("Hello back from firebase");
});

export const ping = https.onCall((data, context) => {
  return "pong";
});

export const createRecurr = https.onCall(async (data, context) => {
  const newRecur: CreateRecurParams = {
    title: data.title,
    duration: data.duration,
  };
  const uid = context.auth?.uid;
  logger.info("Params", newRecur, uid);

  const result = await admin
    .firestore()
    .collection(`users/${uid}/recurs`)
    .add(newRecur);

  logger.info("Created new recur" + result.id);

  const response: CreateRecurResponse = {
    success: true,
    id: result.id,
  };

  return response;
});
