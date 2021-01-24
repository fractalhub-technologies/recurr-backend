import "jest";
import * as functions from "firebase-functions-test";
import { firestore } from "firebase-admin";

const testAdmin = functions(
  {
    projectId: "fractalhub-612ee",
    databaseURL: "http://localhost:9000",
  },
  "./key.json"
);

import { onUserCreate } from "../src";
import { __clearAllDataOnEmulator__ } from "./utils/db";

afterEach(async () => {
  await __clearAllDataOnEmulator__();
});

describe("when user is created", () => {
  let subject = testAdmin.wrap(onUserCreate);
  const uid = "test-user-on-create";

  test("should create user document", async () => {
    await subject({ uid });

    const user = await firestore().doc(`users/${uid}`).get();
    expect(user.exists).toBeTruthy();
    const createdAt = user.data()?.createdAt;
    expect(new Date(createdAt).toString()).not.toEqual("Invalid Date");
    expect(user.data()?.score).toBe(0);
  });
});
