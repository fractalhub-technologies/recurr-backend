import { https } from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp({ projectId: "fractalhub-612ee" });

// handlers
import * as recur from "./handlers/dispatcher";
import * as user from "./handlers/user";
import * as teams from "./handlers/teams";

export const ping = https.onCall((data, context) => {
  return "pong";
});

// recurs
export const fetchCommits = recur.fetchCommits;
export const pushCommits = recur.pushCommits;

// user
export const onUserCreate = user.create;

// team
export const onTeamCreate = teams.onTeamCreate;
export const onMemberAdd = teams.onMemberAdd;
export const nudgeUser = teams.nudgeUser;
export const onTeamCommit = teams.onTeamCommit;