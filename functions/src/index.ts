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

export const getAllRecurs = https.onCall(async (data, context) => {
  const uid = context.auth?.uid;

  const results = await admin
    .firestore()
    .collection(`users/${uid}/recurs`)
    .orderBy("title")
    .get();

  const recurs = results.docs.map((doc) => doc.data());

  const response = {
    success: true,
    data: recurs,
  };

  return response;
});

export const deleteRecur = https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const recurID = data.id;
  const ref = `users/${uid}/recurs/${recurID}`;

  try {
    await admin.firestore().doc(ref).delete();
    return success();
  } catch (err) {
    logger.error("Error while deleting: ", err);
    return error("error-while-deleting");
  }
});

export const updateRecur = https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  const recurID = data.id;
  const updateData = data.updateData;
  const ref = `users/${uid}/recurs/${recurID}`;

  const doc = await admin.firestore().doc(ref).update(updateData);

  return success();
});

const success = () => ({ success: true });
const error = (err: string) => ({ success: false, error: err });
