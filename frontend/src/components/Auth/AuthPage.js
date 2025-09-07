import React, { useState, useEffect, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { Mail, Lock, User, Eye, EyeOff, LogOut, Loader2 } from 'lucide-react';

// This is a single-file, self-contained application.
// All components, context, and logic are defined here.
// It uses Firebase Authentication for sign-in and Firestore for user data.

// The __firebase_config, __app_id, and __initial_auth_token are provided globally.
// This allows the app to connect to a unique Firebase instance.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? initialAuthToken : null;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Context for managing user authentication state
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign in anonymously or with a custom token on app load
  useEffect(() => {
    const signIn = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth initialization failed:", error);
      }
      setLoading(false);
    };
    signIn();

    // Set up an auth state listener to update the user state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading, auth, db, appId };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
const useAuth = () => useContext(AuthContext);