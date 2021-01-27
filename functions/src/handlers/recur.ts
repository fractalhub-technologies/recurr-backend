import { https, logger } from "firebase-functions";
import { Recur, UpdateRecurParams } from "../types/recur";
import { getUidOrThrowError } from "../utils/handler";
import {
  throwErrorIfRecurIsNotOwnedByUser,
  storeRecurInDB,
  getAllRecur,
  deleteRecurFromDB,
  updateRecurInDB,
} from "../domain/recur";

/**
 * CREATE RECUR
 */

export const create = async (data: any, context: any) => {
  const uid = getUidOrThrowError(context);
  const newRecur: Recur = {
    title: data.title,
    duration: data.duration,
    type: "personal",
  };

  logger.info("Creating new recur", newRecur, uid);

  const result = storeRecurInDB(newRecur, uid);
  if ((await result).success) {
    return result;
  }
  logger.error("error while creating recur", (await result).error);
  throw new https.HttpsError("internal", "Internal Server Error while writing");
};
/**
 * GET ALL RECUR
 */
export const getAll = async (_: any, context: any) => {
  const uid = getUidOrThrowError(context);

  logger.info("Getting recurs", uid);

  const data = getAllRecur(uid);

  if ((await data).success) {
    return data;
  }
  logger.error("error while getting recurs", (await data).error);
  throw new https.HttpsError("internal", "Internal Server Error while reading");
};

/**
 * DELETE RECUR
 */
export const deleteRecur = async (data: any, context: any) => {
  const uid = getUidOrThrowError(context);
  const recurID = data.id;

  await throwErrorIfRecurIsNotOwnedByUser(recurID, uid);

  logger.info("Deleting recur", uid, recurID);

  const recurDetails = { uid, recurID };

  const result = deleteRecurFromDB(recurDetails);

  if ((await result).success) {
    return result;
  }
  logger.error(`Error while deleting recur`, (await result).error);
  throw new https.HttpsError("internal", "Internal Server Error");
};

/**
 * UPDATE RECUR
 */
export const update = async (data: UpdateRecurParams, context: any) => {
  const uid = getUidOrThrowError(context);
  const { id, updateData } = data;

  await throwErrorIfRecurIsNotOwnedByUser(id, uid);

  logger.info("Updating recur", uid, updateData);

  const result = updateRecurInDB(id, updateData);
  if ((await result).success) {
    return result;
  }
  logger.error(`Error while updating recur`, (await result).error);
  throw new https.HttpsError("internal", "Internal Server Error");
};
