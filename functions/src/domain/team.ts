import { messaging, firestore } from "firebase-admin";
import { logger } from "firebase-functions";

const _memberAddedPayload = (team: string) => ({
  notification: {
    title: "You were added to a new team 🥳",
    body: `You are now a part of ${team}`,
  },
});

export async function sendMemberAddedNotification(uid: string, team: string) {
  const user = await firestore().collection("users").doc(uid).get();
  const data = user.data();
  if (data) {
    await messaging().sendToDevice(data.tokens, _memberAddedPayload(team), {
      priority: "high",
    });
  } else {
    logger.error("User data not found ", uid);
  }
}

const _nudgePayload = (team: string, currentUser: string) => ({
  notification: {
    title: `🔔  ${team} 🔔`,
    body: `${currentUser} is nudging you to finish all your recurs!`,
  },
});

export async function sendNudgeNotification(
  uid: string,
  team: string,
  currentUser: string
) {
  const user = await firestore().collection("users").doc(uid).get();
  const data = user.data();
  if (data) {
    await messaging().sendToDevice(data.tokens, _nudgePayload(team, currentUser), {
      priority: "high",
    });
  } else {
    logger.error("User data not found ", uid);
  }
}
