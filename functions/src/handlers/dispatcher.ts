import { https, logger } from "firebase-functions";
import { create, update, getAll, deleteRecur } from "./recur";
import { success } from "../utils/handler";

export const dispatch = https.onCall(async (data, context) => {
  if (data.length > 0) {
    for (const request of data) {
      let action = request[0];
      let payload = request[1];

      switch (action) {
        case "CREATE_RECUR":
          return create(payload, context);
        case "UPDATE_RECUR":
          return update(payload, context);
        case "DELETE_RECUR":
          return deleteRecur(payload, context);
        default:
          logger.info("Invalid action", action);
          throw new https.HttpsError("invalid-argument", "Invalid action!");
      }
    }
    return success();
  }
  return getAll({}, context);
});
