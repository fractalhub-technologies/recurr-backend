import "jest";

export const testFirebaseError = (
  errMessage: string,
  subject: Function,
  ...args: any[]
) => async () => {
  expect.assertions(1);
  try {
    await subject(...args);
  } catch (err) {
    expect(err.message).toEqual(errMessage);
  }
};
