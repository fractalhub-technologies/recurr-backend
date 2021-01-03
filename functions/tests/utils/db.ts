import axios from "axios";
import { firestore } from "firebase-admin";
import { Recur } from "../../src/types/recur";

export async function __clearAllDataOnEmulator__() {
  return axios.delete(
    "http://localhost:8080/emulator/v1/projects/fractalhub-612ee/databases/(default)/documents",
  );
}

export const createTestUser = async (uid: string) => {
  await firestore().doc(`users/${uid}`).create({
    recurs: [],
  });
};

export const createTestRecurs = async (
  recurs: Recur[],
  uid: string,
): Promise<string[]> => {
  let ids: string[] = [];
  for (const recur of recurs) {
    const recurResult = await firestore().collection("recurs").add(recur);
    await firestore()
      .doc(`users/${uid}`)
      .update({
        recurs: firestore.FieldValue.arrayUnion(recurResult.id),
      });
    ids.push(recurResult.id);
  }
  return ids;
};
