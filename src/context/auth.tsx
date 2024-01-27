import React, {
  useEffect,
  useState,
  useContext,
  PropsWithChildren,
} from "react";
import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FIRESTORE_DB, FIREBASE_AUTH as auth } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const initialState = {
  uid: "",
  createdAt: "",
  email: "",
  name: "",
};

interface User {
  uid: string;
  createdAt: string;
  email: string;
  name: string;
}

interface ContextInterface {
  user: User | null;
  signOut: () => void;
}

const contextInitialState: ContextInterface = {
  user: initialState,
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
      if (firebaseUser?.emailVerified) {
        const userDoc = await getDoc(
          doc(FIRESTORE_DB, "Users", firebaseUser.uid)
        );
        const userData: User = {
          uid: firebaseUser.providerData[0].uid,
          createdAt: firebaseUser.metadata.creationTime!,
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

  return (
    <AuthContext.Provider
      value={{
        user,
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
