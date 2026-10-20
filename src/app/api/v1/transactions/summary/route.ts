import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import * as z from "zod";

const querySchema = z.object({
  granularity: z.enum(["month", "year"]).default("month"),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export async function GET(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid query" }, { status: 400 });
  const { granularity, year } = parsed.data;

  try {
    // Prisma.sql + parameter binding SQL injection (granularity pass as enum)
    const unit = Prisma.raw(`'${granularity}'`);
    const yearFilter = year
      ? Prisma.sql`AND EXTRACT(YEAR FROM "date" AT TIME ZONE 'Asia/Bangkok') = ${year}`
      : Prisma.empty;

    const rows = await prisma.$queryRaw<
      { period: Date; type: "INCOME" | "EXPENSE"; total: Prisma.Decimal }[]
    >(Prisma.sql`
      SELECT
        date_trunc(${unit}, "date" AT TIME ZONE 'Asia/Bangkok') AS period,
        "type",
        SUM("amount") AS total
      FROM "Transaction"
      WHERE "userId" = ${userId}
      ${yearFilter}
      GROUP BY period, "type"
      ORDER BY period ASC
    `);

    // Aggregate INCOME/EXPENSE
    const map = new Map<string, { income: number; expense: number }>();
    for (const r of rows) {
      const key = r.period
        .toISOString()
        .slice(0, granularity === "year" ? 4 : 7);
      const item = map.get(key) ?? { income: 0, expense: 0 };
      if (r.type === "INCOME") item.income += Number(r.total);
      else item.expense += Number(r.total);
      map.set(key, item);
    }

    const result = [...map].map(([period, v]) => ({
      period, // "2026-10" or "2026"
      income: Math.round(v.income * 100) / 100,
      expense: Math.round(v.expense * 100) / 100,
      net: Math.round((v.income - v.expense) * 100) / 100,
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("GET /api/v1/transactions/summary failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
