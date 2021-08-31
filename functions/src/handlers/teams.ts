import { firestore, https, logger } from "firebase-functions";
import { actionNotifications } from "../constants";
import {
  sendMemberAddedNotification,
  sendNudgeNotification,
  addUserAsOwnerToTeam,
  sendTeamCommitNotification,
} from "../domain/team";
import { getUidOrThrowError } from "../utils/handler";

export const onTeamCreate = firestore
  .document("/teams/{id}")
  .onCreate((snapshot, context) => {
    const teamData = snapshot.data();
    const id = context.params.id;
    logger.debug("ON TEAM CREATE", id, teamData);

    return addUserAsOwnerToTeam(id, teamData.createdBy);
  });

export const onMemberAdd = firestore
  .document("/teams/{tID}/members/{mID}")
  .onCreate((snapshot, context) => {
    const memberData = snapshot.data();
    const memberRef = snapshot.ref;
    logger.debug("ON MEMBER CREATE", memberData, context.params);

    if (memberData.isOwner) {
      logger.info("Skipping due to member being owner");
      return;
    }

    const teamRef = memberRef.parent.parent;
    if (teamRef !== null) {
      return teamRef.get().then((team) => {
        const teamData = team.data();
        const teamID = team.id;
        if (teamData) {
          return sendMemberAddedNotification(memberData.uid, teamID, teamData.name);
        }
        logger.error("Team data not found", context.params);
        return null;
      });
    } else {
      logger.error("TEAM PARENT NULL", context.params);
      return false;
    }
  });

export const nudgeUser = https.onCall(async (data, context) => {
  logger.info("Nudging...");
  getUidOrThrowError(context);
  const { targetUid, teamName, currentUserName } = data;

  if (!targetUid || !teamName || !currentUserName) {
    return false;
  }

  try {
    await sendNudgeNotification(targetUid, teamName, currentUserName);
    return true;
  } catch (err) {
    logger.error("Error while notifying: ", err);
    return false;
  }
});

export const onTeamCommit = firestore
  .document("/teams/{teamID}/commits/{commitID}")
  .onCreate((snapshot, context) => {
    const { teamID } = context.params;
    const commitData = snapshot.data();
    const { action, payload, user } = commitData;
    logger.debug("ON TEAM COMMIT", teamID, action, payload);

    if (!Object.keys(actionNotifications).includes(action)) {
      logger.info("Skipping action cause not present", teamID, action);
    }

    return sendTeamCommitNotification(teamID, user, action, payload);
  });