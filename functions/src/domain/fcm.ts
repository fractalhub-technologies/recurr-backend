import { actionNotifications } from "../constants";

const notification = (title: string, subtitle: string, data: any = {}) => ({
  notification: {
    icon: "",
    title,
    subtitle,
  },
  data,
});

export const memberAdded = (teamID: string, teamName: string) =>
  notification(
    "You were added to a new team 🥳",
    `You are now a part of ${teamName}`,
    { type: "NEW_TEAM", team_id: teamID }
  );

export const nudge = (team: string, currentUser: string) =>
  notification(
    `🔔  ${team} 🔔`,
    `${currentUser} is nudging you to finish all your recurs!`
  );

export const teamAction = (
  author: string,
  action: string,
  teamName: string,
  teamID: string
) => {
  const msg = (actionNotifications as any)[action];
  const title = author + msg;
  const data = { type: "TEAM_COMMIT", team_id: teamID };
  return notification(title, `in team ${teamName}`, data);
};
