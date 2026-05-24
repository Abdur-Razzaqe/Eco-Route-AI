"use client";

import { useAuth } from "@/context/AuthContext";
import UserView from "@/components/dashboard/UserView";
import BusinessView from "@/components/dashboard/BusinessView";

export default function DashboardPage() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-emerald-400 font-medium">
        Loading Your Dashboard Space...
      </div>
    );
  }

  if (role === "business") {
    return <BusinessView />;
  }

  return <UserView user={user} />;
}
