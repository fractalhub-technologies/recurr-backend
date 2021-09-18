import { actionNotifications, LOGO_URL } from "../constants";

const notification = (title: string, subtitle: string, data: any = {}) => ({
  notification: {
    icon: LOGO_URL,
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

export function nudge (team: string, currentUser: string, type: string) {
  let message;
  
  if (type == 'DONE_NUDGE') {
    message = `Good job completing all recurs for ${team} 💯`
  } else {
    message = `We still got recurs to complete for ${team}`
  }

  return notification(
    `${currentUser} nudged you 👉`,
    message,
  );
}

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
