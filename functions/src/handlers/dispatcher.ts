import { https, logger } from "firebase-functions";
import { create, update, getAll, deleteRecur } from "./recur";

export const dispatch = https.onCall(async (data, context) => {
  data.forEach((request: any) => {
    let action = request[0];
    let payload = request[1];

    switch (action) {
      case "CREATE_RECUR":
        create(payload, context);
        break;
      case "UPDATE_RECUR":
        update(payload, context);
        break;
      case "GETALL_RECUR":
        getAll(payload, context);
        break;
      case "DELETE_RECUR":
        deleteRecur(payload, context);
        break;
      default:
        logger.info("Invalid action", action);
        throw new https.HttpsError("invalid-argument", "Invalid action!");
    }
  });
});
