import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Activity from "@/models/Activity";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, transportType, distance, description } = body;

    if (!userId || !transportType || !distance) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    // 🔬 সায়েন্টিফিক কার্বন ইমিশন ফ্যাক্টরস (প্রতি কিমি-এ কেজি CO2)
    // ড্রাইভিংয়ে সবচেয়ে বেশি ইমিশন হয়, পাবলিক ট্রানজিটে কম, আর সাইকেল/হাঁটায় ০ ইমিশন।
    let emissionFactor = 0;
    if (transportType === "driving") emissionFactor = 0.21; // ২১০ গ্রাম প্রতি কিমি
    if (transportType === "transit") emissionFactor = 0.08; // ৮০ গ্রাম প্রতি কিমি
    if (transportType === "bicycling" || transportType === "walking")
      emissionFactor = 0.0;

    const carbonEmission = distance * emissionFactor;

    // 🎁 গ্রিন পয়েন্ট ক্যালকুলেশন লজিক
    // ইউজার যদি পরিবেশ-বান্ধব মাধ্যম (সাইকেল/হাঁটা) বেছে নেয়, তবে সে বোনাস পয়েন্ট পাবে।
    let pointsEarned = 0;
    if (transportType === "bicycling" || transportType === "walking") {
      pointsEarned = Math.round(distance * 10); // প্রতি কিমিতে ১০ পয়েন্ট বোনাস!
    } else {
      pointsEarned = Math.round(distance * 2); // অন্য মাধ্যমে প্রতি কিমিতে ২ পয়েন্ট
    }

    // ১. মঙ্গোডিবি `activities` কালেকশনে নতুন লগ সেভ করা
    const newActivity = await Activity.create({
      userId,
      transportType,
      distance: Number(distance),
      carbonEmission,
      description: description || `Logged a ${transportType} trip.`,
    });

    // ২. ইউজারের প্রোফাইলে গ্রিন পয়েন্ট আপডেট (Increment) করা
    await User.findOneAndUpdate(
      { uid: userId },
      { $inc: { greenPoints: pointsEarned } },
      { upsert: true }, // ইউজার ডাটাবেজে না থাকলে ক্রিয়েট করে নেবে
    );

    return NextResponse.json({
      success: true,
      message: "Activity logged successfully!",
      data: newActivity,
      pointsEarned,
      carbonEmission,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
