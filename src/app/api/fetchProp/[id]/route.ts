import { connectDB } from "@/lib/Database/database";
import FileSchema from "@/lib/Schema_Models/FileSchema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({
        status: 401,
        message: "Authorization Failed !",
      });

    const id = params.id;
    if (!id)
      return NextResponse.json({ status: 404, message: "Id not found !" });

    await connectDB();

    const data = await FileSchema.findById(id);

    if (!data)
      return NextResponse.json({ status: 404, message: "Data not found !" });

    return NextResponse.json({
      status: 200,
      message: "Data Found.",
      result: data,
    });
  } catch (error) {
    console.error(
      "Error while downloading file:",
      (error as Error).stack || error
    );
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error!",
    });
  }
}
