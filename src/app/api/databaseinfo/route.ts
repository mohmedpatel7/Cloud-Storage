import { connectDB } from "@/lib/Database/database";
import { NextResponse } from "next/server";
import FileSchema from "@/lib/Schema_Models/FileSchema";
import { auth } from "@clerk/nextjs/server";

export const GET = async () => {
  try {
    // ✅ Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const files = await FileSchema.find().select("type size");

    let totalSize = 0;

    const stats = {
      Images: { type: "Images", count: 0, size: 0 },
      Videos: { type: "Videos", count: 0, size: 0 },
      Documents: { type: "Documents", count: 0, size: 0 },
      Audio: { type: "Audio", count: 0, size: 0 },
    };

    files.forEach((file) => {
      const size = file.size || 0;
      totalSize += size;

      const mime = file.type || "";

      if (mime.startsWith("image/")) {
        stats.Images.count++;
        stats.Images.size += size;
      } else if (mime.startsWith("video/")) {
        stats.Videos.count++;
        stats.Videos.size += size;
      } else if (mime.startsWith("audio/")) {
        stats.Audio.count++;
        stats.Audio.size += size;
      } else if (
        mime === "application/pdf" ||
        mime === "application/msword" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        "application/vnd.openxmlformats-officedocument.presentationml.presentat…" ||
        mime.startsWith("text/")
      ) {
        stats.Documents.count++;
        stats.Documents.size += size;
      }
    });

    // Optional: if you still want a percentage (e.g., vs 512 MB)
    const maxStorageBytes = 512 * 1024 * 1024;
    const usedPercent = Math.min(
      (totalSize / maxStorageBytes) * 100,
      100
    ).toFixed(1);

    return NextResponse.json({
      storage: {
        used: formatBytes(totalSize),
        usedPercent,
        maxStorage: "512 MB", // Informational only
      },
      fileStats: Object.values(stats).map((s) => ({
        ...s,
        size: formatBytes(s.size),
      })),
    });
  } catch (error) {
    return NextResponse.json({
      error: "Server Error",
      status: 500,
      Error: error,
    });
  }
};

// Utility to format bytes to human-readable units
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
