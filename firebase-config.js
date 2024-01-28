import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDY2cuykYgtOZYD95ruEltCh1HTbWR6glM",
  authDomain: "muvo1s.firebaseapp.com",
  projectId: "muvo1s",
  storageBucket: "muvo1s.appspot.com",
  messagingSenderId: "760391256093",
  appId: "1:760391256093:web:07a3a6b224ebda31125ef4",
  measurementId: "G-6R1X90TXHC",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
