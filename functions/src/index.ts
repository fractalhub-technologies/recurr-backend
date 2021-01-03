import { https } from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp({ projectId: "fractalhub-612ee" });

// handlers
import * as recur from "./handlers/recur";
import * as check from "./handlers/checkin";

export const ping = https.onCall((data, context) => {
  return "pong";
});

// recurs
export const createRecur = recur.create;
export const getAllRecurs = recur.getAll;
export const updateRecur = recur.update;
export const deleteRecur = recur.deleteRecur;
// checins
export const checkInRecur = check.inRecur;
