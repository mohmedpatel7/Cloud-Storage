import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/Database/database";
import FileSchema from "@/lib/Schema_Models/FileSchema";
import { auth } from "@clerk/nextjs/server";
import fs from "fs/promises";
import path from "path";

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authorization Failed!" },
        { status: 401 }
      );
    }

    const id = await params.id;
    if (!id) {
      return NextResponse.json({ error: "Id not found!" }, { status: 404 });
    }

    await connectDB();

    // Find the file record in MongoDB
    const file = await FileSchema.findById(id);
    if (!file) {
      return NextResponse.json(
        { error: "File not found in DB!" },
        { status: 404 }
      );
    }

    // Build the absolute path to the file in /public/uploads/
    // file.filePath is like "/uploads/filename.ext"
    const fileToDeletePath = path.join(
      process.cwd(),
      "public",
      file.filePath.replace(/^\\|^\//, "")
    );

    try {
      await fs.unlink(fileToDeletePath);
    } catch (err: unknown) {
      // If file is not found, log and continue (not a critical error)
      if (err && typeof err === "object" && "code" in err) {
        const errorWithCode = err as NodeJS.ErrnoException;
        if (errorWithCode.code !== "ENOENT") {
          return NextResponse.json(
            {
              error: "Error deleting file from disk",
              details: errorWithCode.message,
            },
            { status: 500 }
          );
        }
        // ENOENT: file already missing, continue to delete DB record
        console.warn("File not found on disk, continuing to delete DB record.");
      } else {
        // Unknown error type
        return NextResponse.json(
          { error: "Unknown error deleting file from disk" },
          { status: 500 }
        );
      }
    }

    // Delete the record from MongoDB
    await FileSchema.findByIdAndDelete(id);

    return NextResponse.json({
      status: 200,
      message: "File and database record deleted successfully.",
    });
  } catch (error) {
    console.error("Error in DELETE route:", (error as Error).stack || error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error!",
    });
  }
};
