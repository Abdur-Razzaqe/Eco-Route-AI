"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase"; // আপনার প্রোজেক্টের সঠিক পাথ অনুযায়ী চেক করে নেবেন
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  role: "user" | "business" | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    name: string,
    selectedRole: "user" | "business",
  ) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"user" | "business" | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 📡 মঙ্গোডিবি ব্যাকএন্ড থেকে ইউজারের রোল তুলে আনার ফাংশন
  const fetchUserRole = async (uid: string) => {
    try {
      const res = await fetch(`/api/user?uid=${uid}`);
      const data = await res.json();
      if (data.success && data.role) {
        setRole(data.role);
      } else {
        setRole("user"); // ব্যাকআপ হিসেবে ডিফল্ট রোল 'user'
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      setRole("user");
    }
  };

  // 🔄 ফায়ারবেস অথ সেশন ট্র্যাকিং
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🌐 গুগল দিয়ে লগইন/সাইন-আপ
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            role: "user",
          }),
        });
        await fetchUserRole(result.user.uid);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google Login Failed:", error);
    }
  };

  // ✉️ ইমেইল ও পাসওয়ার্ড দিয়ে নতুন অ্যাকাউন্ট তৈরি (রোল সহ)
  const registerWithEmail = async (
    email: string,
    password: string,
    name: string,
    selectedRole: "user" | "business",
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          name: name,
          email: email,
          role: selectedRole,
        }),
      });

      setUser({ ...userCredential.user, displayName: name });
      setRole(selectedRole);
      router.push("/dashboard");
    }
  };

  // 🔑 ইমেইল ও পাসওয়ার্ড দিয়ে লগইন
  const loginWithEmail = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    if (userCredential.user) {
      await fetchUserRole(userCredential.user.uid);
      router.push("/dashboard");
    }
  };

  // 🚪 সাইন-আউট / লগআউট (ফুল ফিক্সড লজিক)
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth); // ১. ফায়ারবেস থেকে লগআউট
      setRole(null); // ২. লোকাল রোল স্টেট ক্লিয়ার
      setUser(null); // ৩. লোকাল ইউজার স্টেট ক্লিয়ার

      // ৪. ক্লায়েন্ট সাইড ক্যাশ এবং স্টেট ক্লিয়ার করে মেইন রুটে রিডাইরেক্ট
      router.refresh();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginWithGoogle,
        registerWithEmail,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
