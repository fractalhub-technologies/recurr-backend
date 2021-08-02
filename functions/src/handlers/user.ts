import * as users from "../domain/user";
import { logger, auth } from "firebase-functions";

export const create = auth.user().onCreate(async (user) => {
  logger.info("New user create!")
  try {
    await users.createUser(user);
  } catch (err) {
    logger.error("Error while creating user", err);
  }
});
