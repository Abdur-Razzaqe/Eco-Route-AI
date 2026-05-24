"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShoppingBag, Award } from "lucide-react";

export default function MarketplacePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  useEffect(() => {
    // প্রোডাক্ট লোড করা
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      });

    // ইউজারের কারেন্ট গ্রিন পয়েন্ট ব্যাকএন্ড থেকে রিড করা
    if (user?.uid) {
      fetch(`/api/user?uid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUserPoints(data.greenPoints || 0);
        });
    }
  }, [user]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Green Marketplace</h1>
          <p className="text-slate-400 text-sm">
            Redeem your hard-earned eco-points for real green rewards.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
          <Award className="text-emerald-400" size={20} />
          <span className="text-white font-bold">
            {userPoints} Points Available
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div
            key={product._id}
            className="bg-slate-900/20 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-colors"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5 space-y-4">
              <h3 className="text-lg font-bold text-white">{product.title}</h3>
              <p className="text-slate-400 text-xs line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 font-semibold text-sm">
                  {product.pointsRequired} Points
                </span>
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                  <ShoppingBag size={14} /> Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
