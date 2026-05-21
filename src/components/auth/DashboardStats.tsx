"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardStats() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Eco-Route Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Welcome, {user.displayName}!
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-4 py-2 rounded-xl border border-red-500/20 transition duration-200"
          >
            Logout
          </button>
        </header>

        <main className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <p className="text-slate-300">
            You are successfully logged in using your Google account (
            <span className="text-emerald-400">{user.email}</span>).
          </p>
          <div className="mt-6 p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl inline-block">
            🌱 Clean Code Architecture Setup Completed!
          </div>
        </main>
      </div>
    </div>
  );
}
