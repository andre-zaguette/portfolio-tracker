import { db } from "@/db";
import { trades } from "@/db/schema";
import { isMatch } from "date-fns";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const body = await req.json();

  if (body.date && !isMatch(body.date, "yyyy-MM-dd")) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  delete body.id;
  try {
    const [updated] = await db
      .update(trades)
      .set(body)
      .where(eq(trades.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PATCH /api/trade/[id]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  try {
    const deleted = await db
      .delete(trades)
      .where(eq(trades.id, id))
      .returning();
    if (!deleted.length) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Trade deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
