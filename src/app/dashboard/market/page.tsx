"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Award,
  CreditCard,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const initialProducts = [
  {
    _id: "p1",
    name: "Bamboo Eco-Water Bottle",
    description:
      "100% organic biodegradable flask keeping beverages insulated for 12 hours.",
    price: 15,
    pointsRequired: 300,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500",
  },
  {
    _id: "p2",
    name: "Solar Powered Power Bank",
    description:
      "High efficiency 20,000mAh backup charger fueled by direct sunlight.",
    price: 35,
    pointsRequired: 700,
    image: "https://images.unsplash.com/photo-1609592424263-d1607a7ec928?w=500",
  },
  {
    _id: "p3",
    name: "Miniature Juniper Bonsai Tree",
    description:
      "Live indoor oxygen-purifying premium botanical plant with custom clay pot.",
    price: 25,
    pointsRequired: 500,
    image: "https://images.unsplash.com/photo-1613143715121-700994f83b4b?w=500",
  },
];

export default function GreenMarketplacePage() {
  const { user } = useAuth();
  const [userPoints, setUserPoints] = useState<number>(0);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // 🛠️ পেমেন্ট কনফার্মেশন মোডাল স্টেট
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      fetch(`/api/dashboard-summary?uid=${user.uid}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUserPoints(data.stats.greenPoints);
        });
    }

    // 💳 স্ট্রাইপ থেকে সাকসেস ইউআরএল নিয়ে ফিরে আসলে কনফার্মেশন মোডাল ওপেন হবে
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      setShowConfirmModal(true);
    }
    if (urlParams.get("canceled") === "true") {
      toast.error("Payment session was canceled by user.", { duration: 4000 });
    }
  }, [user]);

  // 👍 ইউজার কনফার্ম করলে এই ফাংশন রান হবে
  const handleConfirmOrder = () => {
    setShowConfirmModal(false);
    // ইউআরএল থেকে সাকসেস টোকেন ক্লিন করা
    window.history.replaceState({}, document.title, "/dashboard/market");

    // 🔥 প্রিমিয়াম সাকসেস টোস্ট অ্যালার্ট
    toast.custom(
      (t) => (
        <div
          className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-slate-900 border border-emerald-500/30 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 backdrop-blur-md`}
        >
          <div className="flex-1 w-0">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle className="h-10 w-10 text-emerald-400" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-white">Order Confirmed!</p>
                <p className="mt-1 text-xs text-slate-400">
                  Your secure Stripe checkout token verified. Eco-product
                  shipment initialized.
                </p>
              </div>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-transparent rounded-md text-slate-500 hover:text-slate-400 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <XCircle size={18} />
            </button>
          </div>
        </div>
      ),
      { duration: 5000 },
    );
  };

  // 👎 ইউজার ক্যানসেল করলে এই ফাংশন রান হবে
  const handleCancelOrder = () => {
    setShowConfirmModal(false);
    window.history.replaceState({}, document.title, "/dashboard/market");
    toast.error("Order verification declined by user.", { duration: 4000 });
  };

  const handleAction = async (
    productId: string,
    method: "points" | "stripe",
  ) => {
    setLoadingId(`${productId}-${method}`);

    try {
      const res = await fetch("/api/market/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          productId,
          paymentMethod: method,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (method === "stripe" && data.url) {
          window.location.href = data.url; // স্ট্রাইপ গেটওয়েতে রিডাইরেক্ট
        } else {
          toast.success(data.message, { id: "points-toast" });
          setUserPoints(data.pointsLeft);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Network communications failed.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-6 p-2 pb-16 text-slate-100 relative"
    >
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/30 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-amber-400" /> Green Rewards Market
          </h1>
          <p className="text-slate-400 text-sm">
            Trade accumulated carbon points or use direct banking to secure
            elite sustainable assets.
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-5 py-3 rounded-xl flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Your Balance
            </p>
            <h4 className="text-lg font-black text-amber-400">
              {userPoints}{" "}
              <span className="text-xs font-normal text-slate-400">Pts</span>
            </h4>
          </div>
        </div>
      </div>

      {/* প্রোডাক্ট গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialProducts.map((product) => (
          <div
            key={product._id}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between backdrop-blur-md hover:border-slate-700/60 transition-all group"
          >
            <div className="w-full h-48 relative overflow-hidden bg-slate-950">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 font-extrabold text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1">
                <Sparkles size={12} /> {product.pointsRequired} Pts
              </span>
            </div>
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  {product.name}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  MSRP:{" "}
                  <strong className="text-slate-300">
                    ${product.price}.00
                  </strong>
                </span>
              </div>
            </div>
            <div className="p-5 pt-0 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAction(product._id, "points")}
                disabled={
                  loadingId !== null || userPoints < product.pointsRequired
                }
                className="w-full bg-amber-600/10 hover:bg-amber-600 border border-amber-500/20 hover:border-amber-500 disabled:opacity-40 text-amber-400 hover:text-white font-bold py-2 px-3 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5"
              >
                {loadingId === `${product._id}-points`
                  ? "Processing..."
                  : "Claim with Points"}
              </button>
              <button
                onClick={() => handleAction(product._id, "stripe")}
                disabled={loadingId !== null}
                className="w-full bg-slate-950/60 hover:bg-slate-100 border border-slate-800 hover:border-white disabled:opacity-40 text-slate-300 hover:text-slate-950 font-bold py-2 px-3 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5"
              >
                <CreditCard size={12} />{" "}
                {loadingId === `${product._id}-stripe`
                  ? "Redirecting..."
                  : `Buy for $${product.price}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔮 ডায়নামিক কনফার্মেশন মোডাল (Confirm / Cancel পপ-আপ) */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl space-y-4 text-center"
            >
              <div className="mx-auto bg-amber-500/10 w-12 h-12 rounded-full flex items-center justify-center text-amber-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Verify Your Secure Purchase?
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Stripe transaction completed successfully. Do you wish to
                  confirm and log this order into your green dashboard system?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleCancelOrder}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors"
                >
                  Cancel Order
                </button>
                <button
                  onClick={handleConfirmOrder}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Confirm & Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
