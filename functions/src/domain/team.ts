import { firestore } from "firebase-admin";

export function addOwnerAsMember(teamID: string, ownerUID: string) {
  return firestore().collection(`teams/${teamID}/members`).add({
    uid: ownerUID,
    addedAt: new Date().toISOString(),
  })
}