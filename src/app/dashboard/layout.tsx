"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import { Toaster } from "react-hot-toast"; // 💡 টোস্ট ইম্পোর্ট করা হলো

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // লগইন না থাকলে হোম বা লগইন পেজে রিডাইরেক্ট
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          {/* একটি ছোট অ্যানিমেশন ইফেক্ট ডেমো ইন্টারভিউয়ের জন্য */}
          <div className="w-8 h-8 border-4 border-t-emerald-400 border-emerald-950 rounded-full animate-spin"></div>
          <span>Loading Eco-Ecosystem...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* 🔮 গ্লোবাল টোস্ট কন্টেইনার (এটি পুরো ড্যাশবোর্ডের টোস্ট কন্ট্রোল করবে) */}
      <Toaster
        position="top-center"
        toastOptions={{
          // ডিফল্ট ডার্ক থিম স্টাইলিং যা আপনার ড্যাশবোর্ডের সাথে ১০০% ম্যাচ করবে
          style: {
            background: "#0f172a", // slate-900
            color: "#f8fafc", // slate-50
            border: "1px solid rgba(51, 65, 85, 0.5)", // slate-700/50
          },
        }}
      />

      {/* বামে ফিক্সড সাইডবার */}
      <div className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* ডানে মেইন কন্টেন্ট এরিয়া */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => {}} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900/20">
          {children}
        </main>
      </div>
    </div>
  );
}
