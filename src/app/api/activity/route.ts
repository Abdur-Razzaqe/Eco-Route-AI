import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Activity from "@/models/Activity";

const EMISSION_FACTORS: Record<string, number> = {
  driving: 0.12,
  transit: 0.04,
  bicycling: 0.0,
  walking: 0.0,
};

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, transportType, distance } = body;

    if (!userId || !transportType || !distance) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const factor = EMISSION_FACTORS[transportType] ?? 0;
    const carbonEmission = Number((distance * factor).toFixed(2));

    const newActivity = await Activity.create({
      userId,
      transportType,
      distance: Number(distance),
      carbonEmission,
    });

    return NextResponse.json({ success: true, data: newActivity });
  } catch (error: any) {
    // এখানে সার্ভার লেভেলে কোনো ভুল হলে তা HTML পেজ না পাঠিয়ে প্রপার JSON পাঠাবে
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 },
      );
    }

    const logs = await Activity.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
