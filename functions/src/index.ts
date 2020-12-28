import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";

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

interface Recur {
  title: string;
  duration: number;
}

export const createRecurr = https.onCall(async (data, context) => {
  const newRecur: Recur = {
    title: data.title,
    duration: data.duration,
  };
  logger.info(newRecur);

  const result = await admin
    .firestore()
    .collection("testing-recurs")
    .add(newRecur);

  logger.info("Created new recur " + result.id);

  return {
    success: true,
    id: result.id,
  };
});
