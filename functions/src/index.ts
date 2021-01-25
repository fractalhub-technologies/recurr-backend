import { https } from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp({ projectId: "fractalhub-612ee" });

// handlers
import * as recur from "./handlers/dispatcher";
import * as user from "./handlers/user";
import * as check from "./handlers/checkin";

export const ping = https.onCall((data, context) => {
  return "pong";
});

// recurs
export const dispatch = recur.dispatch;

// checins
export const checkInRecur = check.inRecur;
// user
export const onUserCreate = user.create;
