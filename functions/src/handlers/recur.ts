import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import {
  CreateRecurParams,
  CreateRecurResponse,
  ListRecurResponse,
  UpdateRecurParams,
  Response,
} from "../types/recur";

const getUidOrThrowError = (context: https.CallableContext): string => {
  const uid = context.auth?.uid;

  if (!uid) {
    throw new https.HttpsError("unauthenticated", "User not logged in");
  }

  return uid;
};

/**
 * CREATE RECUR
 */
export const create = https.onCall(async (data, context) => {
  const newRecur: CreateRecurParams = {
    title: data.title,
    duration: data.duration,
  };
  const uid = getUidOrThrowError(context);

  logger.info("Params", newRecur, uid);

  const result = await admin
    .firestore()
    .collection(`users/${uid}/recurs`)
    .add(newRecur);

  logger.info("Created new recur" + result.id);

  const response: CreateRecurResponse = {
    success: true,
    data: {
      id: result.id,
    },
  };
  return response;
});

/**
 * GET ALL RECUR
 */
export const getAll = https.onCall(async (_, context) => {
  const uid = getUidOrThrowError(context);

  const results = await admin
    .firestore()
    .collection(`users/${uid}/recurs`)
    .orderBy("title")
    .get();

  const recurs = results.docs.map((doc) => doc.data());

  const response: ListRecurResponse = {
    success: true,
    data: recurs,
  };

  return response;
});

/**
 * DELETE RECUR
 */
export const deleteRecur = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);
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

/**
 * UPDATE RECUR
 */
export const update = https.onCall(async (data: UpdateRecurParams, context) => {
  const uid = getUidOrThrowError(context);
  const { id, updateData } = data;
  const ref = `users/${uid}/recurs/${id}`;

  await admin.firestore().doc(ref).update(updateData);

  return success();
});

const success = (): Response => ({ success: true });
const error = (err: string): Response => ({ success: false, error: err });
