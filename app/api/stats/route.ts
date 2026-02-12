import { NextResponse } from "next/server";
import { calculateStorageStats } from "./service";

export async function GET() {
  try {
    const stats = await calculateStorageStats();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("[Stats Route] - Failed to get storage stats", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
