import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Activity from "@/models/Activity";

export async function DELETE(
  request: NextRequest, // 💡 Request থেকে NextRequest করা হলো (Standard Type)
  context: { params: Promise<{ id: string }> }, // 💡 Next.js 16 অনুযায়ী params এখন Promise
) {
  try {
    await dbConnect();

    // 🌍 ১. params-কে প্রথমে await করে id বের করে আনা হলো
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Activity ID is required" },
        { status: 400 },
      );
    }

    await Activity.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, message: "Activity deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
