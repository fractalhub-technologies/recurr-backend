import { firestore } from "firebase-admin";

interface User {
  createdAt: string;
  score: number;
}

type FsResult = Promise<firestore.WriteResult>;

export function createUser(uid: string): FsResult {
  const newUser: User = {
    createdAt: new Date().toISOString(),
    score: 0,
  };
  const newRef = `users/${uid}`;

  return firestore().doc(newRef).set(newUser);
}
