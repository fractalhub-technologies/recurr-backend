import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const helloWorld = functions.https.onRequest((req, res) => {
  functions.logger.info("Hello world from Firebase TS", {
    structuredData: true,
  });
  res.status(200).send("Hello back from firebase");
});
