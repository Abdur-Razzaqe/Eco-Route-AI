"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // 👈 ১. useAuth ইম্পোর্ট করা হলো
import {
  LayoutDashboard,
  Leaf,
  Route,
  ShoppingBag,
  Settings,
  User,
  X,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth(); // 👈 ২. logout ফাংশন তুলে আনা হলো

  const mainNav = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Carbon Tracker", href: "/dashboard/tracker", icon: Leaf },
    { name: "Eco Routing", href: "/dashboard/navigator", icon: Route },
    { name: "Marketplace", href: "/dashboard/market", icon: ShoppingBag }, // আপনার পেইজ রাউট অনুযায়ী /dashboard/market বা /dashboard/marketplace মিলিয়ে নেবেন
  ];

  const managementNav = [
    { name: "Profile Settings", href: "/dashboard/profile", icon: User },
    { name: "Security & Plan", href: "/dashboard/security", icon: ShieldCheck },
    { name: "System Settings", href: "/dashboard/settings", icon: Settings },
  ];

  // 🚪 সাইডবার থেকে সেফ লগআউট হ্যান্ডলার
  const handleSidebarLogout = async () => {
    if (onClose) onClose(); // মোবাইল মেনু ওপেন থাকলে তা বন্ধ করার জন্য
    await logout();
  };

  const NavLink = ({ item }: { item: any }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isActive
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
        }`}
      >
        <item.icon size={18} />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm">
      {/* Sidebar Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
            🌱
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hidden sm:inline">
            EcoRoute
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1 text-slate-400 hover:text-slate-200"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Core Features
          </p>
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>

        <div>
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Management
          </p>
          <div className="space-y-1">
            {managementNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        {/* 🚪 এখানে onClick={handleSidebarLogout} প্রপারলি কানেক্ট করা হয়েছে */}
        <button
          onClick={handleSidebarLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
