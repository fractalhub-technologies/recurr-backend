import "jest";
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as myfuncs from "../src";
import { CreateRecurParams, CreateRecurResponse } from "../src/types/recur";

const testAdmin = functions(
  {
    projectId: "fractalhub-612ee",
    databaseURL: "http://localhost:900",
  },
  "./key.json",
);

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

    const doc = admin.firestore().doc(ref);
    const docData = await doc.get();
    expect(docData.exists).toBeTruthy();
    expect(docData.data()).toEqual(params);
  });
});
