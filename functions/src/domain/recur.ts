import { https } from "firebase-functions";
import * as admin from "firebase-admin";
import * as c from "../constants";

import { error, success } from "../utils/handler";
import { Recur } from "../types/recur";

const { arrayUnion, arrayRemove } = admin.firestore.FieldValue;
const { documentId } = admin.firestore.FieldPath;

const db = admin.firestore();

export const throwErrorIfRecurIsNotOwnedByUser = async (
  recurId: string,
  uid: string
) => {
  const user = await db.doc(`users/${uid}`).get();
  const userRecurs: string[] = user.data()?.recurs;
  if (!userRecurs.includes(recurId)) {
    throw new https.HttpsError("not-found", c.errMessages.notFound);
  }
};

export const storeRecurInDB = async (data: Recur, uid: any) => {
  try {
    const recurResult = await db.collection("recurs").add(data);

    await db.doc(`users/${uid}`).update({
      recurs: arrayUnion(recurResult.id),
    });
    return success({ id: recurResult.id });
  } catch (err) {
    return error(err);
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
    return error(err);
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
    return error(err);
  }
};

export const updateRecurInDB = async (id: string, data: any) => {
  try {
    await db.doc(`recurs/${id}`).update(data);
    return success();
  } catch (err) {
    return error(err);
  }
};
