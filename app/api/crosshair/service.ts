import { Crosshair, Prisma } from "@/app/generated/prisma/client";
import { ICrosshairPayload } from "@/app/shared/types/crosshair";
import { NotFoundError } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const addCrosshairService = async (
  data: ICrosshairPayload,
): Promise<Crosshair> => {
  try {
    const crosshair = await prisma.crosshair.create({
      data: {
        code: data.code,
        description: data.description || "",
        name: data.name,
        imageUrl: data.imageUrl,
      },
    });
    return crosshair;
  } catch (error) {
    console.error("[Crosshair Service] - Failed to create crosshair", error);
    throw error;
  }
};

export const fetchAllCrosshair = async (
  page = 1,
  limit = 12,
): Promise<{ crosshairs: Crosshair[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const [crosshairs, total] = await prisma.$transaction([
      prisma.crosshair.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "asc" },
      }),
      prisma.crosshair.count(),
    ]);

    return { crosshairs, total };
  } catch (error) {
    console.error("[Crosshair Service] - Failed to fetch crosshair", error);
    throw error;
  }
};

export const deleteCrosshairById = async (id: string): Promise<void> => {
  try {
    await prisma.crosshair.delete({
      where: { id },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundError("Crosshair not found");
    }
    console.error("[Crosshair Service] - Failed to delete crosshair", error);
    throw error;
  }
};
