import { https } from "firebase-functions";
import { Response } from "../types/recur";
import * as c from "../constants";

export const getUidOrThrowError = (context: https.CallableContext): string => {
  const uid = context.auth?.uid;

  if (!uid) {
    throw new https.HttpsError("unauthenticated", c.errMessages.notLoggedIn);
  }

  return uid;
};

export const success = (data = {}): Response => ({ success: true, data });

export const error = (err: string): Response => ({
  success: false,
  error: err,
});
