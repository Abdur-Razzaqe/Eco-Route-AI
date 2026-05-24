"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 text-sm">
          Manage your personal eco-profile and credentials.
        </p>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div>
            <h3 className="text-md font-bold text-white">
              {user?.displayName || "Eco Warrior"}
            </h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">
              Display Name
            </label>
            <input
              type="text"
              defaultValue={user?.displayName || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-emerald-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 font-medium">
              Email Address
            </label>
            <input
              type="email"
              disabled
              defaultValue={user?.email || ""}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-500 cursor-not-allowed outline-none"
            />
          </div>
        </div>

        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition">
          Update Profile
        </button>
      </div>
    </div>
  );
}
