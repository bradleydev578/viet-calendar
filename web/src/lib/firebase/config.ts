import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFHNW2CKnnmrbEGfBDAFTjbPxKtw9hFPQ",
  authDomain: "viet-calendar-f4318.firebaseapp.com",
  projectId: "viet-calendar-f4318",
  storageBucket: "viet-calendar-f4318.firebasestorage.app",
  messagingSenderId: "82934330355",
  appId: "1:82934330355:web:a918b399b5d34048ee1886",
  measurementId: "G-11DN380MNN",
};

// Initialize Firebase (singleton pattern)
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Analytics instance (lazy loaded, client-side only)
let analyticsInstance: Analytics | null = null;

export async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;

  if (analyticsInstance) return analyticsInstance;

  const supported = await isSupported();
  if (supported) {
    analyticsInstance = getAnalytics(app);
  }

  return analyticsInstance;
}
