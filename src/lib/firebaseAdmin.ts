// functions/src/firebaseAdmin.ts
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing Firebase Admin env vars");
}

const app: App =
  getApps()[0] ??
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Optional: connect to local emulators
if (process.env.FIREBASE_USE_EMULATORS === "true") {
  // Firestore emulator (default host:port)
  db.settings({ host: "localhost:8080", ssl: false });
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  // Auth emulator
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
  // Storage emulator
  process.env.FIREBASE_STORAGE_EMULATOR_HOST = "localhost:9199";
}

export { app, auth, db, storage };
