import { db } from "@/db";
import { portfolios } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.select().from(portfolios);
    console.log("IDs:", data);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Erro detalhado:", e);
    return NextResponse.json(
      { error: e.message, stack: e.stack },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const [created] = await db
    .insert(portfolios)
    .values({
      name: body.name,
      initialValue: body.initialValue,
    })
    .returning();
  return NextResponse.json(created);
}
