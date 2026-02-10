import { createCrosshairSchema } from "@/app/shared/zod schema/crosshair";
import { NextRequest, NextResponse } from "next/server";
import {
  addCrosshairService,
  deleteCrosshairById,
  fetchAllCrosshair,
} from "./service";
import { NotFoundError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    
    const data = await fetchAllCrosshair(page, limit);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = createCrosshairSchema.parse(body);

    const crosshair = await addCrosshairService(validatedData);
    return NextResponse.json(crosshair, { status: 201 });
  } catch (error) {
    console.error("[Crosshair route] - Failed to create error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    await deleteCrosshairById(body.id);
    return NextResponse.json({ deleted: true }, { status: 200 });
  } catch (error) {
    console.error("[Crosshair route] - Failed to delete error", error);
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
