import { logger } from "firebase-functions";
import { Recur, UpdateRecurParams } from "../types/recur";
import { getUidOrThrowError } from "../utils/handler";
import { throwErrorIfRecurIsNotOwnedByUser } from "../domain/recur";

import {
  storeRecurInDB,
  getAllRecur,
  deleteRecurFromDB,
  updateRecurInDB,
} from "../domain/db";

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

  return storeRecurInDB(newRecur, uid);
};
/**
 * GET ALL RECUR
 */
export const getAll = async (_: any, context: any) => {
  const uid = getUidOrThrowError(context);

  logger.info("Getting recurs", uid);

  return getAllRecur(uid);
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

  return deleteRecurFromDB(recurDetails);
};

/**
 * UPDATE RECUR
 */
export const update = async (data: UpdateRecurParams, context: any) => {
  const uid = getUidOrThrowError(context);
  const { id, updateData } = data;

  await throwErrorIfRecurIsNotOwnedByUser(id, uid);

  logger.info("Updating recur", uid, updateData);

  return updateRecurInDB(id, updateData);
};
