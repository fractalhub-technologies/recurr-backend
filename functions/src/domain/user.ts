import { auth, firestore } from "firebase-admin";
import { logger } from "firebase-functions";

interface User {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
}

type FsResult = Promise<firestore.WriteResult>;

export function createUser(user: auth.UserRecord): FsResult {
  const newUser: User = {
    email: user.email || "",
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    createdAt: new Date().toISOString(),
  };

  logger.debug("User dump: ", newUser);
  const newRef = `users/${user.uid}`;

  return firestore().doc(newRef).set(newUser);
}

export async function hasUserEnabledNotifications(
  uid: String
): Promise<boolean> {
  const user = await firestore().doc(`users/${uid}`).get();
  const data = user.data();

  if (!data) {
    return true;
  }

  const settings = data["settings"] || { masterNotificationToggle: true }; // default for people will be true
  return !!settings["masterNotificationToggle"];
}
