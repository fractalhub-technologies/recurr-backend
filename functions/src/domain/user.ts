import { auth, firestore } from "firebase-admin";

/*
interface User {
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
}
*/

type FsResult = Promise<firestore.WriteResult>;

export function createUser(user: auth.UserRecord): FsResult {
  const newUser = user.toJSON();
  const newRef = `users/${user.uid}`;

  return firestore().doc(newRef).set(newUser);
}
