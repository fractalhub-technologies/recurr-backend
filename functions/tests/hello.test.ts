import "jest";
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as myfuncs from "../src";
import {
  CreateRecurParams,
  CreateRecurResponse,
  Recur,
} from "../src/types/recur";
import { __clearAllDataOnEmulator__ } from "./utils";

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

describe("test test", () => {
  let subject = testAdmin.wrap(myfuncs.ping);

  test("test 1", () => {
    const result = subject({});
    expect(result).toEqual("pong");
  });
});

describe("create recur", () => {
  let subject = testAdmin.wrap(myfuncs.createRecurr);

  test("if entity is created", async () => {
    const uid = "user12345";

    const params: CreateRecurParams = {
      title: "My own entity",
      duration: 20,
    };

    const context = {
      auth: { uid },
    };

    const result: CreateRecurResponse = await subject(params, context);
    expect(result.success).toBeTruthy();

    const ref = `users/${uid}/recurs/${result.id}`;

    const doc = db.doc(ref);
    const docData = await doc.get();
    expect(docData.exists).toBeTruthy();
    expect(docData.data()).toEqual(params);
  });
});

describe("get all recurs", () => {
  let subject = testAdmin.wrap(myfuncs.getAllRecurs);
  const uid = "user-all-123";
  const recurs: Recur[] = [
    { title: "Recur 1", duration: 10 },
    { title: "Recur 2", duration: 20 },
    { title: "Recur 3", duration: 30 },
  ];

  beforeAll(async () => {
    for (const recur of recurs) {
      await db.collection(`users/${uid}/recurs`).add(recur);
    }
  });

  test("should return all recurs for the user", async () => {
    const context = { auth: { uid } };
    const result = await subject({}, context);

    expect(result.success).toBeTruthy();
    expect(result.data.length).toEqual(3);
    expect(result.data).toEqual(recurs);
  });
});

describe("delete recur", () => {
  let subject = testAdmin.wrap(myfuncs.deleteRecur);
  const uid = "user-delete-123";

  const recur: Recur = { title: "Recur to be deleted", duration: 10 };
  let targetId: string;

  beforeAll(async () => {
    const result = await db.collection(`users/${uid}/recurs`).add(recur);
    targetId = result.id;
  });

  test("recur should be deleted", async () => {
    const data = { id: targetId };
    const context = { auth: { uid } };

    const response = await subject(data, context);
    expect(response.success).toBeTruthy();

    const recur = await db.collection(`users/${uid}/recurs`).get();
    expect(recur.empty).toBeTruthy();
  });
});

describe("update recur", () => {
  let subject = testAdmin.wrap(myfuncs.updateRecur);
  const uid = "user-update-123";

  const recur: Recur = { title: "Recur to be updated", duration: 10 };
  let targetId: string;

  beforeAll(async () => {
    const result = await db.collection(`users/${uid}/recurs`).add(recur);
    targetId = result.id;
  });

  test("recur should be updated", async () => {
    const updateData = {
      title: "Recur has been updated",
      duration: 20,
    };
    const data = { id: targetId, updateData };
    const context = { auth: { uid } };

    const response = await subject(data, context);
    expect(response.success).toBeTruthy();

    const updatedRecur = await (
      await db.doc(`users/${uid}/recurs/${targetId}`).get()
    ).data();
    expect(updatedRecur.title).toEqual(updateData.title);
    expect(updatedRecur.duration).toEqual(updateData.duration);
  });
});
