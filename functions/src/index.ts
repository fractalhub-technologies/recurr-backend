import { https, logger } from "firebase-functions";
const admin = require("firebase-admin");

admin.initializeApp();

export const helloWorld = https.onRequest((req, res) => {
  logger.info("Hello world from Firebase TS", {
    structuredData: true,
  });
  res.status(200).send("Hello back from firebase");
});

interface Recur {
  title: string;
  duration: number;
}

export const createRecurr = https.onRequest(async (req, res) => {
  const newRecur: Recur = {
    title: req.body.title,
    duration: req.body.duration,
  };
  logger.info(newRecur);

  admin.firestore().collection("testing-recurs").add(newRecur);
  res.status(200).send("pong");
});
