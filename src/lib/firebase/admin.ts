import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const cert = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    });
    admin.initializeApp({
      credential: cert,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } catch (e) {
    // If env vars are missing (e.g. during build), fallback silently or initialize with default for build
    console.warn('Firebase admin initialization fallback due to missing credentials.', e);
    admin.initializeApp();
  }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const adminAuth = admin.auth();
