import { NextResponse } from "next/server";
import { connectDB } from "@/lib/Database/database";
import FileSchema from "@/lib/Schema_Models/FileSchema";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();

    const data = await FileSchema.find({
      $or: [
        { type: { $regex: "^application/", $options: "i" } },
        { type: { $regex: "^text/", $options: "i" } },
      ],
    }).sort({ uploadDate: -1 });

    if (!data) return NextResponse.json({ message: "Data Not Found !" });

    return NextResponse.json({
      message: "Data Found.",
      status: 200,
      Result: data,
    });
  } catch (error) {
    console.error("Fetch failed:", (error as Error).stack || error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error!",
    });
  }
}
