import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_measurementId,
};

// ১. Next.js হট রিলোড সেফ ইনিশিয়ালাইজেশন
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ২. অথেনটিকেশন ইনিশিয়ালাইজেশন এবং এক্সপোর্ট করার ব্যবস্থা
const auth = getAuth(app);

// ৩. অ্যানালিটিক্স সেফলি হ্যান্ডেল করা (নেক্সট-জেএস ব্যাকএন্ড বা সার্ভারে যেন ক্র্যাশ না করে)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
