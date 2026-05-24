import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "User UID required" },
        { status: 400 },
      );
    }

    // ১. ইউজার কালেকশন থেকে গ্রিন পয়েন্ট রিড করা
    const dbUser = await User.findOne({ uid });
    const greenPoints = dbUser ? dbUser.greenPoints : 0;

    // ২. অ্যাক্টিভিটি কালেকশন থেকে ইউজারের সব ট্রাভেল লগ আনা
    const activities = await Activity.find({ userId: uid });

    let totalCo2Saved = 0;
    let transportCount = 0;
    let energyCount = 0;
    let foodCount = 0;

    // ৩. লাইভ ক্যালকুলেশন (ডাটাবেজ ডেটা সামারি করা)
    activities.forEach((act: any) => {
      // এখানে উদাহরণস্বরূপ আমরা ধরে নিচ্ছি কার্বন সেভড কাউন্ট হচ্ছে
      totalCo2Saved += act.carbonEmission;

      // চার্টের ক্যাটাগরি ম্যাপিং (আপনার ইনপুট অনুযায়ী)
      if (act.transportType === "driving" || act.transportType === "transit") {
        transportCount += act.distance;
      } else if (
        act.transportType === "bicycling" ||
        act.transportType === "walking"
      ) {
        // ইকো-ফ্রেন্ডলি ট্রিপগুলো ফুয়েল ও কার্বন সেভ করে
        totalCo2Saved += act.distance * 0.2;
      }
    });

    // ৪. পাই চার্টের জন্য ডাইনামিক ফরম্যাট রেডি করা
    const dynamicChartData = [
      { name: "Transport (Eco)", value: transportCount || 1, color: "#10b981" },
      {
        name: "Saved Impact",
        value: Math.round(totalCo2Saved) || 1,
        color: "#06b6d4",
      },
      {
        name: "Other Activities",
        value: activities.length || 1,
        color: "#f59e0b",
      },
    ];

    return NextResponse.json({
      success: true,
      stats: {
        totalCo2Saved: totalCo2Saved.toFixed(1),
        greenPoints,
        totalTrips: activities.length,
      },
      chartData: dynamicChartData,
      aiSuggestion:
        activities.length > 0
          ? `Great job! You have completed ${activities.length} eco-friendly trips this month.`
          : "No activities logged yet. Start tracking your travel to generate AI suggestions!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
