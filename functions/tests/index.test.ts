import "jest";
import * as functions from "firebase-functions-test";
import * as myfuncs from "../src";

const testAdmin = functions(
  {
    projectId: "fractalhub-612ee",
    databaseURL: "http://localhost:9000",
  },
  "./key.json"
);

describe("test test", () => {
  let subject = testAdmin.wrap(myfuncs.ping);

  test("test 1", () => {
    const result = subject({});
    expect(result).toEqual("pong");
  });
});
