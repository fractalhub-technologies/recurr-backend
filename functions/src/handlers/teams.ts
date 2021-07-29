import { firestore, logger } from "firebase-functions";
import { addOwnerAsMember } from "../domain/team";

export const onTeamCreate = firestore
  .document("/teams/{id}")
  .onCreate((snapshot, context) => {
    const team = snapshot.data();
    const id = context.params.id;
    logger.debug("ON TEAM CREATE", team, context.params);

    addOwnerAsMember(id, team.created_by)
      .then((_) => {
        logger.info("Successfully added owner as team member");
      })
      .catch((err) => {
        logger.error("Error while adding owner as team member: ", err);
      });
  });
