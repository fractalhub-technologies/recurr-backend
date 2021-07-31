import { messaging, firestore } from "firebase-admin";
import { logger } from "firebase-functions";

const _payload = (team: string) => ({
  notification: {
    title: "You were added to a new team 🥳",
    body: `You are now a part of ${team}`,
  },
});

export async function sendMemberAddedNotification(uid: string, team: string) {
  const user = await firestore().collection("users").doc(uid).get();
  const data = user.data();
  if (data) {
    logger.debug("User tokens: ", data.tokens);
    await messaging().sendToDevice(data.tokens, _payload(team), {
      priority: "high",
    });
  } else {
    logger.error("User data not found ", uid);
  }
}
