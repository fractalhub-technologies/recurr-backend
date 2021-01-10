import "jest";
import * as functions from "firebase-functions-test";
import * as admin from "firebase-admin";
import * as myfuncs from "../src";
import {
  CreateRecurParams,
  CreateRecurResponse,
  ListRecurResponse,
  Recur,
  UpdateRecurParams,
} from "../src/types/recur";
import {
  __clearAllDataOnEmulator__,
  createTestUser,
  createTestRecurs,
} from "./utils/db";
import { testFirebaseError } from "./utils/response";
import * as c from "../src/constants";

const testAdmin = functions(
  {
    projectId: "fractalhub-612ee",
    databaseURL: "http://localhost:9000",
  },
  "./key.json",
);
const db = admin.firestore();

afterEach(async () => {
  await __clearAllDataOnEmulator__();
});

const getUserRecurs = async (uid: string) => {
  const usersRecurs = await db.doc(`users/${uid}`).get();
  return usersRecurs.data()?.recurs;
};

describe("create recur", () => {
  let subject = testAdmin.wrap(myfuncs.createRecur);
  const uid = "test-user-create-recur";
  const context = {
    auth: { uid },
  };
  const params: CreateRecurParams = {
    title: "My first entity",
    duration: 10,
  };

  beforeEach(async () => {
    await createTestUser(uid);
  });

  test(
    "when user context not there",
    testFirebaseError(c.errMessages.notLoggedIn, subject, params),
  );

  test("if entity is created", async () => {
    const result: CreateRecurResponse = await subject(params, context);
    expect(result.success).toBeTruthy();

    const newRecur = await db.doc(`recurs/${result.data.id}`).get();
    expect(newRecur.exists).toBeTruthy();
    expect(newRecur.data()?.title).toEqual(params.title);
    expect(newRecur.data()?.duration).toEqual(params.duration);
    expect(newRecur.data()?.type).toEqual("personal");

    const usersRecurs = await getUserRecurs(uid);
    expect(usersRecurs).toEqual([result.data.id]);
  });

  test("when two entities are created", async () => {
    const secondParams: CreateRecurParams = {
      title: "My second entity",
      duration: 20,
    };

    const firstRes: CreateRecurResponse = await subject(params, context);
    expect(firstRes.success).toBeTruthy();

    const secondRes: CreateRecurResponse = await subject(secondParams, context);
    expect(secondRes.success).toBeTruthy();

    const usersRecurs = await getUserRecurs(uid);
    const expected = [firstRes.data.id, secondRes.data.id];
    expect(usersRecurs).toEqual(expected);
  });
});

describe("get all recurs", () => {
  let subject = testAdmin.wrap(myfuncs.getAllRecurs);
  const uid = "test-user-all-recurs";
  const recurs: Recur[] = [
    { title: "Recur 1", duration: 10 },
    { title: "Recur 2", duration: 20 },
    { title: "Recur 3", duration: 30 },
  ];

  beforeEach(async () => {
    await createTestUser(uid);
  });

  test(
    "when user context not there",
    testFirebaseError(c.errMessages.notLoggedIn, subject, {}),
  );

  test("should return all recurs for the user", async () => {
    const createdIds = await createTestRecurs(recurs, uid);
    const context = { auth: { uid } };
    const result: ListRecurResponse = await subject({}, context);

    expect(result.success).toBeTruthy();
    expect(result.data.length).toEqual(3);
    const resultIds = result.data.map((r) => r.id).sort();
    expect(resultIds).toEqual(createdIds.sort());
  });
});

describe("delete recur", () => {
  let subject = testAdmin.wrap(myfuncs.deleteRecur);
  const uid = "test-user-delete-recur";
  const context = { auth: { uid } };
  const recurs: Recur[] = [
    { title: "Recur 1", duration: 10 },
    { title: "Recur 2", duration: 20 },
  ];
  let createdIds: string[];

  beforeEach(async () => {
    await createTestUser(uid);
    createdIds = await createTestRecurs(recurs, uid);
  });

  test(
    "when user context not there",
    testFirebaseError(c.errMessages.notLoggedIn, subject, { id: "12345" }),
  );

  test("recur should be deleted", async () => {
    const data = { id: createdIds[0] };

    const beforeRecurs = await getUserRecurs(uid);
    expect(beforeRecurs).toEqual(createdIds);

    const recurToBeDeleted = db.doc(`recurs/${createdIds[0]}`);
    expect((await recurToBeDeleted.get()).exists).toBeTruthy();

    const response = await subject(data, context);
    expect(response.success).toBeTruthy();

    const afterRecurs = await getUserRecurs(uid);
    expect(afterRecurs).toEqual([createdIds[1]]);
    expect((await recurToBeDeleted.get()).exists).toBeFalsy();
  });

  test(
    "when user does not own recur",
    testFirebaseError(
      c.errMessages.notFound,
      subject,
      { id: "random-recur" },
      context,
    ),
  );
});

describe("update recur", () => {
  let subject = testAdmin.wrap(myfuncs.updateRecur);
  const uid = "test-user-update-recur";
  const context = { auth: { uid } };

  const recur: Recur = { title: "Recur to be updated", duration: 10 };
  const updateData = {
    title: "Recur has been updated",
    duration: 20,
  };
  let targetId: string;

  beforeEach(async () => {
    await createTestUser(uid);
    const ids = await createTestRecurs([recur], uid);
    targetId = ids[0];
  });

  test("recur should be updated", async () => {
    const data: UpdateRecurParams = { id: targetId, updateData };

    const response = await subject(data, context);
    expect(response.success).toBeTruthy();

    const doc = await db.doc(`/recurs/${targetId}`).get();
    const updatedRecur = doc.data();
    expect(updatedRecur).toBeDefined();
    expect(updatedRecur?.title).toEqual(updateData.title);
    expect(updatedRecur?.duration).toEqual(updateData.duration);
  });

  test(
    "when user context not there",
    testFirebaseError(c.errMessages.notLoggedIn, subject, {
      id: "12345",
      updateData: { title: "No please" },
    }),
  );

  test(
    "when user does not own recur",
    testFirebaseError(
      c.errMessages.notFound,
      subject,
      { id: "random-recur", updateData },
      context,
    ),
  );
});
