import * as admin from "firebase-admin";
import { https } from "firebase-functions";
import * as c from "../constants";

const db = admin.firestore();

export const throwErrorIfRecurIsNotOwnedByUser = async (
  recurId: string,
  uid: string,
) => {
  const user = await db.doc(`users/${uid}`).get();
  const userRecurs: string[] = user.data()?.recurs;
  if (!userRecurs.includes(recurId)) {
    throw new https.HttpsError("not-found", c.errMessages.notFound);
  }
};
