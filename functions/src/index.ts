import { https } from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp({ projectId: "fractalhub-612ee" });

import * as recur from "./handlers/recur";

export const ping = https.onCall((data, context) => {
  return "pong";
});

export const createRecur = recur.create;
export const getAllRecurs = recur.getAll;
export const updateRecur = recur.update;
export const deleteRecur = recur.deleteRecur;
