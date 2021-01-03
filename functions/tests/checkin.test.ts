import "jest";
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as myfuncs from "../src";
import {
  __clearAllDataOnEmulator__,
  createTestUser,
  createTestRecurs,
} from "./utils/db";
import { Recur, Response } from "../src/types/recur";
import { CheckInParams } from "../src/types/checkin";
import { testFirebaseError } from "./utils/response";
import * as c from "../src/constants";

const testAdmin = functions(
  {
    projectId: "fractalhub-612ee",
    databaseURL: "http://localhost:900",
  },
  "./key.json",
);
const db = admin.firestore();

afterEach(async () => {
  await __clearAllDataOnEmulator__();
});

describe("check in recur", () => {
  const subject = testAdmin.wrap(myfuncs.checkInRecur);
  const uid = "test-user-check-in";
  const context = { auth: { uid } };
  const recur: Recur = { title: "To be checked in", duration: 10 };
  const timestamp = new Date().toISOString();

  beforeEach(async () => {
    await createTestUser(uid);
  });

  test(
    "when user is not authenticated",
    testFirebaseError(c.errMessages.notLoggedIn, subject, {}),
  );

  test(
    "when user does not own recur",
    testFirebaseError(
      c.errMessages.notFound,
      subject,
      { recurId: "dummy", timestamp },
      context,
    ),
  );

  test("should create a checkin entry", async () => {
    const ids = await createTestRecurs([recur], uid);
    const recurId = ids[0];
    const params: CheckInParams = {
      recurId,
      timestamp,
    };

    const response: Response = await subject(params, context);
    expect(response.success).toBeTruthy();

    const d = new Date(timestamp);
    const expectedRef = `${uid}_${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    const results = await db.collection(`recurs/${recurId}/checkins`).get();
    expect(results.empty).toBeFalsy();
    expect(results.docs.length).toEqual(1);

    const doc = results.docs[0];
    expect(doc.id).toEqual(expectedRef);
    expect(doc.data().uid).toEqual(uid);
    expect(doc.data().timestamp).toEqual(timestamp);
  });
});
