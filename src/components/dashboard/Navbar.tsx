"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Menu, Search, User, LogOut, Settings } from "lucide-react";
import { useState } from "react";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  // 🚪useAuth কনটেক্সট থেকে logout ফাংশনটি ডেসট্রাকচার করে আনা হলো
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // 🚪 লগআউট বাটন হ্যান্ডলার
  const handleLogoutClick = async () => {
    setShowDropdown(false); // ড্রপডাউনটি বন্ধ করার জন্য
    await logout();
  };

  return (
    <nav className="h-16 border-b border-slate-800 bg-slate-950/40 backdrop-blur-sm sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="relative hidden sm:block max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-900 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={14} />
              )}
            </div>
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-800 rounded-lg p-2 shadow-xl z-50">
              <a
                href="/dashboard/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
              >
                <User size={14} /> Profile
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
              >
                <Settings size={14} /> Settings
              </a>

              {/* 🚪 এই বাটনের সাথে onClick ইভেন্ট প্রপারলি কানেক্ট করা হয়েছে */}
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
