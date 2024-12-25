import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let app;
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  };

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  }, 'crime-watch-app');
}

export const adminAuth = admin.auth(app);
export const adminDb = admin.firestore(app);
export default admin;
