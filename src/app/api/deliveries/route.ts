import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Delivery from "@/models/Delivery";

// GET: নির্দিষ্ট বিজনেসের সব ডেলিভারি রুট নিয়ে আসা
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { success: false, message: "Business ID required" },
        { status: 400 },
      );
    }

    const deliveries = await Delivery.find({ businessId }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: deliveries });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST: নতুন ডেলিভারি ট্র্যাকিং রুট সেভ করা
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // একটি ডাইনামিক ইউনিক ডেলিভারি আইডি জেনারেট করা
    const deliveryId =
      "DLV-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const newDelivery = await Delivery.create({
      ...body,
      deliveryId,
    });

    return NextResponse.json({ success: true, data: newDelivery });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
