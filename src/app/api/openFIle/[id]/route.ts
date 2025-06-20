import { connectDB } from "@/lib/Database/database";
import FileSchema from "@/lib/Schema_Models/FileSchema";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({
        status: 401,
        message: "Authorization Failed !",
      });

    const { id } = await context.params;
    if (!id)
      return NextResponse.json({ status: 404, message: "Id not found !" });

    await connectDB();
    const fileDoc = await FileSchema.findById(id);
    if (!fileDoc)
      return NextResponse.json({ status: 404, message: "File not found!" });

    const filePath = path.join(
      process.cwd(),
      "public",
      fileDoc.filePath.replace(/^[/\\]+/, "")
    );
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        status: 404,
        message: "File not found on disk!",
      });
    }

    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);
    // const ext = path.extname(fileDoc.originalName).toLowerCase(); // Not used
    const mimeType = fileDoc.type || "application/octet-stream";

    return new NextResponse(fileStream as unknown as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stat.size.toString(),
        "Content-Disposition": `inline; filename="${fileDoc.originalName}"`,
      },
    });
  } catch (error) {
    console.error("Error while opening file:", (error as Error).stack || error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error!",
    });
  }
}
