import React, {
  useEffect,
  useState,
  useContext,
  PropsWithChildren,
} from "react";
import { router, useRootNavigationState, useSegments } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH as auth } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const initialState = {
  uid: "",
  createdAt: "",
  lastLoginAt: "",
  email: "",
  name: "",
};

interface User {
  uid: string;
  createdAt: string;
  lastLoginAt: string;
  email: string;
  name: string;
}

interface ContextInterface {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const contextInitialState: ContextInterface = {
  user: initialState,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
};

const AuthContext = React.createContext(contextInitialState);

export function useAuth(): ContextInterface {
  const context = useContext<ContextInterface>(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a Provider");
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<User>(initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(
          doc(FIRESTORE_DB, "Users", firebaseUser.uid)
        );
        const userData: User = {
          uid: firebaseUser.providerData[0].uid,
          createdAt: firebaseUser.metadata.creationTime!,
          lastLoginAt: firebaseUser.metadata.lastSignInTime!,
          email: firebaseUser.providerData[0].email!,
          name: userDoc.data()?.name || "",
        };
        setUser(userData);
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      alert("Sign In failed: " + error.message);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;

      await setDoc(doc(FIRESTORE_DB, "Users", newUser.uid), {
        name: name,
        email: email,
        userId: newUser.uid,
        createdAt: newUser.metadata.creationTime!,
        lastLoginAt: newUser.metadata.lastSignInTime!,
      });
    } catch (error: any) {
      alert("Registration failed: " + error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut: () => {
          setUser(initialState);
          signOut(auth);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
