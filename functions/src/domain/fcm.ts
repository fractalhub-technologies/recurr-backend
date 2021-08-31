import { actionNotifications } from "../constants";

const notification = (title: string, subtitle: string) => ({
  notification: {
    icon: "",
    title,
    subtitle,
  },
});

export const memberAdded = (team: string) =>
  notification(
    "You were added to a new team 🥳",
    `You are now a part of ${team}`
  );

export const nudge = (team: string, currentUser: string) =>
  notification(
    `🔔  ${team} 🔔`,
    `${currentUser} is nudging you to finish all your recurs!`
  );

export const teamAction = (author: string, action: string, team: string) => {
  const msg = (actionNotifications as any)[action];
  const title = author + msg;
  return notification(title, `in team ${team}`);
};
