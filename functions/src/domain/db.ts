import { https, logger } from "firebase-functions";
import * as admin from "firebase-admin";

import { error, success } from "../utils/handler";
import { Recur } from "../types/recur";

const db = admin.firestore();
const { arrayUnion, arrayRemove } = admin.firestore.FieldValue;
const { documentId } = admin.firestore.FieldPath;

export const storeRecurInDB = async (data: Recur, uid: any) => {
  try {
    const recurResult = await db.collection("recurs").add(data);

    await db.doc(`users/${uid}`).update({
      recurs: arrayUnion(recurResult.id),
    });
    return success({ id: recurResult.id });
  } catch (err) {
    logger.error("error while creating recur", err);
    throw new https.HttpsError(
      "internal",
      "Internal Server Error while writing"
    );
  }
};

export const getAllRecur = async (uid: string) => {
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
    logger.error("error while getting recurs", err);
    throw new https.HttpsError(
      "internal",
      "Internal Server Error while reading"
    );
  }
};

export const deleteRecurFromDB = async ({
  uid,
  recurID,
}: {
  uid: String;
  recurID: String;
}) => {
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
};

export const updateRecurInDB = async (id: string, data: any) => {
  try {
    await db.doc(`recurs/${id}`).update(data);
    return success();
  } catch (err) {
    logger.error(`Error while updating recur`, error);
    throw new https.HttpsError("internal", "Internal Server Error");
  }
};
