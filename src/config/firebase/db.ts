import admin from "firebase-admin";
const serviceAccount = require("../../../serviceAccountKey.json");

export const connectFirebaseDb = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin.firestore();
};
