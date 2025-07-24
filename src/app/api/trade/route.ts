import { db } from "@/db";
import { trades } from "@/db/schema";
import { isMatch } from "date-fns";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get("portfolioId");
  if (!portfolioId) {
    return NextResponse.json(
      { error: "portfolioId required" },
      { status: 400 }
    );
  }
  const data = await db
    .select()
    .from(trades)
    .where(eq(trades.portfolioId, Number(portfolioId)));
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body.date ||
      typeof body.date !== "string" ||
      !isMatch(body.date, "yyyy-MM-dd")
    ) {
      return NextResponse.json(
        { error: "Invalid or missing date. Expected format: yyyy-MM-dd" },
        { status: 400 }
      );
    }

    const tradeToInsert = {
      ...body,
      date: body.date,
    };

    const [created] = await db.insert(trades).values(tradeToInsert).returning();
    return NextResponse.json(created);
  } catch (error) {
    console.error("POST /api/trade error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
