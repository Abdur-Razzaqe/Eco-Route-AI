"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const { user, loginWithGoogle, registerWithEmail, loginWithEmail, loading } =
    useAuth();
  const router = useRouter();

  // ইমেইল, পাসওয়ার্ড এবং ফর্ম স্টেট ম্যানেজমেন্ট
  const [isRegister, setIsRegister] = useState(false); // true হলে রেজিস্ট্রেশন ফর্ম, false হলে লগইন
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      if (isRegister) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">
          Eco<span className="text-emerald-500">Route</span> AI
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6">
          Track your carbon footprint and make the world greener.
        </p>

        <h2 className="text-xl font-semibold text-slate-200 text-center mb-6">
          {isRegister ? "Create an Account" : "Welcome Back"}
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}

        {/* ইমেইল ও পাসওয়ার্ড ফর্ম */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl transition duration-200"
          >
            {isRegister ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs text-slate-500">or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* গুগল বাটন */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-medium py-2.5 px-4 rounded-xl transition duration-200 active:scale-[0.98]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 15 1 12 1 7.35 1 3.42 3.68 1.5 7.6l3.6 2.8C6.01 7.04 8.76 5.04 12 5.04z"
            />
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.74-2.38 3.58l3.69 2.87c2.16-1.99 3.42-4.92 3.42-8.6z"
            />
            <path
              fill="#FBBC05"
              d="M5.1 14.8c-.25-.76-.39-1.57-.39-2.4s.14-1.64.39-2.4L1.5 7.2C.54 9.12 0 11.25 0 13.5s.54 4.38 1.5 6.3l3.6-2.8z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.69-2.87c-1.02.68-2.33 1.09-3.97 1.09-3.24 0-5.99-2-6.99-4.96l-3.6 2.8C3.42 20.32 7.35 23 12 23z"
            />
          </svg>
          Continue with Google
        </button>

        {/* টগল বাটন (Sign In / Sign Up সুইচ করার জন্য) */}
        <p className="text-xs text-slate-400 text-center mt-6">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-emerald-500 hover:underline font-medium focus:outline-none"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
