import { firestore, https, logger } from "firebase-functions";
import {
  sendMemberAddedNotification,
  sendNudgeNotification,
} from "../domain/team";
import { getUidOrThrowError } from "../utils/handler";

export const onTeamCreate = firestore
  .document("/teams/{id}")
  .onCreate((snapshot, context) => {
    const teamData = snapshot.data();
    const teamRef = snapshot.ref;
    const id = context.params.id;
    logger.debug("ON TEAM CREATE", id, teamData);

    return teamRef.collection("members").add({
      _memberTeamID: id,
      uid: teamData.createdBy,
      addedAt: new Date().toISOString(),
      isOwner: true,
    });
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
        if (teamData) {
          return sendMemberAddedNotification(memberData.uid, teamData.name);
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
