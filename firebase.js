import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJUMqJxCZ2RFFiRqIsYO9-EYgWkkDdiWs",
  authDomain: "frequency-dance-agency-5b7c9.firebaseapp.com",
  projectId: "frequency-dance-agency-5b7c9",
  storageBucket: "frequency-dance-agency-5b7c9.firebasestorage.app",
  messagingSenderId: "149394055478",
  appId: "1:149394055478:web:fed774d8213719aa9bd397",
  measurementId: "G-MY11SE3L06"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
