import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface StorageStats {
  totalCrosshairs: number;
  databaseStorageBytes: number;
  databaseStorageKB: number;
  cloudinaryStorageBytes: number;
  cloudinaryStorageMB: number;
  totalStorageBytes: number;
  totalStorageMB: number;
}

export const calculateStorageStats = async (): Promise<StorageStats> => {
  try {
    const crosshairs = await prisma.crosshair.findMany();

    let databaseBytes = 0;

    for (const crosshair of crosshairs) {
      databaseBytes += Buffer.byteLength(crosshair.id, "utf8");
      databaseBytes += Buffer.byteLength(crosshair.name, "utf8");
      databaseBytes += Buffer.byteLength(crosshair.code, "utf8");
      databaseBytes += Buffer.byteLength(crosshair.description || "", "utf8");
      databaseBytes += Buffer.byteLength(crosshair.imageUrl, "utf8");
      databaseBytes += Buffer.byteLength(crosshair.imagePublicId, "utf8");

      databaseBytes += 8;
    }

    let cloudinaryBytes = 0;
    try {
      const usage = await cloudinary.api.usage();

      cloudinaryBytes = usage.storage?.usage || 0;
    } catch (cloudinaryError) {
      console.warn(
        "[Stats Service] - Could not fetch Cloudinary usage, using 0",
        cloudinaryError,
      );
    }

    const totalBytes = databaseBytes + cloudinaryBytes;

    return {
      totalCrosshairs: crosshairs.length,
      databaseStorageBytes: databaseBytes,
      databaseStorageKB: databaseBytes / 1024,
      cloudinaryStorageBytes: cloudinaryBytes,
      cloudinaryStorageMB: cloudinaryBytes / (1024 * 1024),
      totalStorageBytes: totalBytes,
      totalStorageMB: totalBytes / (1024 * 1024),
    };
  } catch (error) {
    console.error("[Stats Service] - Failed to calculate storage stats", error);
    throw error;
  }
};
