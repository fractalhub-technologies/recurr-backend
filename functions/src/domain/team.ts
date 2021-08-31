import { messaging, firestore } from "firebase-admin";
import { logger } from "firebase-functions";
import * as fcm from "./fcm";

export async function sendMemberAddedNotification(uid: string, teamID: string, teamName: string) {
  const user = await firestore().collection("users").doc(uid).get();
  const data = user.data();
  if (data) {
    await messaging().sendToDevice(data.tokens, fcm.memberAdded(teamID, teamName), {
      priority: "high",
    });
  } else {
    logger.error("User data not found ", uid);
  }
}

export async function sendNudgeNotification(
  uid: string,
  team: string,
  currentUser: string
) {
  const user = await firestore().collection("users").doc(uid).get();
  const data = user.data();
  if (data) {
    await messaging().sendToDevice(data.tokens, fcm.nudge(team, currentUser), {
      priority: "high",
    });
  } else {
    logger.error("User data not found ", uid);
  }
}

export async function addUserAsOwnerToTeam(team: string, uid: string) {
  const details = {
    _memberTeamID: team,
    uid,
    addedAt: new Date().toISOString(),
    isOwner: true,
  };

  await firestore().doc(`/teams/${team}/members/${uid}`).set(details);
}

export async function sendTeamCommitNotification(
  teamID: string,
  author: string,
  action: string,
  payload: any
) {
  const team = await firestore().doc(`teams/${teamID}`).get();
  const teamName = team.data()!.name;
  logger.debug("Fetched team name", { teamName, teamID, action });

  const _user = await firestore().doc(`users/${author}`).get();
  const userName = _user.data()!.displayName ?? " ";
  const firstName = userName.split(" ")[0];
  logger.debug("Fetched user name", { firstName, teamID, action });

  const members = await firestore()
    .collection(`teams/${teamID}/members`)
    .where("uid", "!=", author)
    .get();

  const membersToSendNotifications = members.docs.map((mem) => mem.data().uid);
  logger.debug("Fetched members", {
    membersToSendNotifications,
    teamID,
    action,
  });

  membersToSendNotifications.forEach((uid) => {
    firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((user) => {
        const data = user.data();
        if (data) {
          messaging()
            .sendToDevice(
              data.tokens,
              fcm.teamAction(firstName, action, teamName, teamID),
              { priority: "high" }
            )
            .catch((err) => logger.error("Error in send to device ", err));
        } else {
          logger.error("User data not found ", uid);
        }
      })
      .catch((err) => logger.error("Error while sending notif ", err));
  });
}
