import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";
import { Recur, UpdateRecurParams } from "../types/recur";
import { error, getUidOrThrowError, success } from "../utils/handler";
import { throwErrorIfRecurIsNotOwnedByUser } from "../domain/recur";

const db = admin.firestore();
const { arrayUnion, arrayRemove } = admin.firestore.FieldValue;
const { documentId } = admin.firestore.FieldPath;

/**
 * CREATE RECUR
 */
export const create = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);
  const newRecur: Recur = {
    title: data.title,
    duration: data.duration,
    type: "personal",
  };
  logger.info("Creating new recur", newRecur, uid);

  try {
    const recurResult = await db.collection("recurs").add(newRecur);
    await db.doc(`users/${uid}`).update({
      recurs: arrayUnion(recurResult.id),
    });
    return success({ id: recurResult.id });
  } catch (err) {
    logger.error("error while creating recur", err);
    throw new https.HttpsError(
      "internal",
      "Internal Server Error while writing",
    );
  }
});

/**
 * GET ALL RECUR
 */
export const getAll = https.onCall(async (_, context) => {
  const uid = getUidOrThrowError(context);

  try {
    const userDoc = await db.doc(`users/${uid}`).get();
    const userRecurs = userDoc.data()?.recurs;
    const recursDoc = await db
      .collection("recurs")
      .where(documentId(), "in", userRecurs)
      .get();
    const recurs = recursDoc.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return success(recurs);
  } catch (err) {
    logger.error("error while gettnig recurs", err);
    throw new https.HttpsError(
      "internal",
      "Internal Server Error while reading",
    );
  }
});

/**
 * DELETE RECUR
 */
export const deleteRecur = https.onCall(async (data, context) => {
  const uid = getUidOrThrowError(context);
  const recurID = data.id;

  await throwErrorIfRecurIsNotOwnedByUser(recurID, uid);

  try {
    await db.doc(`recurs/${recurID}`).delete();
    await db.doc(`users/${uid}`).update({
      recurs: arrayRemove(recurID),
    });
    return success();
  } catch (err) {
    logger.error(`Error while deleting recur`, error);
    throw new https.HttpsError("internal", "Internal Server Error");
  }
});

/**
 * UPDATE RECUR
 */
export const update = https.onCall(async (data: UpdateRecurParams, context) => {
  const uid = getUidOrThrowError(context);
  const { id, updateData } = data;

  await throwErrorIfRecurIsNotOwnedByUser(id, uid);

  try {
    await db.doc(`recurs/${id}`).update(updateData);
    return success();
  } catch (err) {
    logger.error(`Error while updating recur`, error);
    throw new https.HttpsError("internal", "Internal Server Error");
  }
});
