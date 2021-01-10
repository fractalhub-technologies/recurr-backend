import * as users from "../domain/user";
import { logger, auth } from "firebase-functions";

export const create = auth.user().onCreate(async (user) => {
  try {
    await users.createUser(user.uid);
  } catch (err) {
    logger.error("Error while creating user", err);
  }
});
