import "jest";
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as myfuncs from "../src";

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
    const params = {
      title: "My own entity",
      duration: 20,
    };

    interface Result {
      success: boolean;
      id: string;
    }
    const result: Result = await subject(params);
    expect(result.success).toBeTruthy();

    const doc = admin.firestore().doc("testing-recurs/" + result.id);
    const docData = await doc.get();
    expect(docData.exists).toBeTruthy();
    expect(docData.data()).toEqual(params);
  });
});
