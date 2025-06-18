import { NextResponse } from "next/server";
import { connectDB } from "@/lib/Database/database";
import FileSchema from "@/lib/Schema_Models/FileSchema";
import path from "path";
import fs from "fs";
import { auth, currentUser } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
  try {
    // ✅ Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // (Optional) Get user profile
    const user = await currentUser();

    // ✅ Get form data and extract file
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No valid file uploaded" },
        { status: 400 }
      );
    }

    // ✅ Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // ✅ Create unique file name and path
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    // ✅ Ensure uploads folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Write the file to the uploads folder
    fs.writeFileSync(filePath, buffer);

    // ✅ Save metadata to MongoDB
    await connectDB();

    const saved = await FileSchema.create({
      originalName: file.name,
      storedName: fileName,
      filePath: `/uploads/${fileName}`,
      size: file.size,
      type: file.type,
      uploadedBy: user?.emailAddresses?.[0]?.emailAddress || userId,
    });

    return NextResponse.json({
      status: 200,
      message: "Uploaded Successfully.",
      file: saved,
    });
  } catch (error) {
    console.error("Upload failed:", (error as Error).stack || error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error!",
    });
  }
};

export const GET = async () => {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await connectDB();

    const data = await FileSchema.find().sort({ uploadDate: -1 });
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
};
