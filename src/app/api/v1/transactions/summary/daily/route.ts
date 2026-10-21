import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { toBangkokDay } from "@/lib/date-range";
import { NextResponse } from "next/server";
import * as z from "zod";

const querySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .optional(), // "2026-10"
});

const monthStart = (ym: string) => new Date(`${ym}-01T00:00:00+07:00`);
const nextMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
};

export async function GET(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = querySchema.safeParse(
    Object.fromEntries(new URL(req.url).searchParams),
  );
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid query" }, { status: 400 });

  const month =
    parsed.data.month ?? toBangkokDay(new Date().toISOString()).slice(0, 7);
  const start = monthStart(month);
  const end = monthStart(nextMonth(month));

  try {
    const rows = await prisma.$queryRaw<
      { day: string; type: "INCOME" | "EXPENSE"; total: Prisma.Decimal }[]
    >(Prisma.sql`
      SELECT
        to_char(("date" AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Bangkok', 'YYYY-MM-DD') AS day,
        "type",
        SUM("amount") AS total
      FROM "Transaction"
      WHERE "userId" = ${userId}
        AND "date" >= ${start} AND "date" < ${end}
      GROUP BY day, "type"
      ORDER BY day ASC
    `);

    const map = new Map<string, { income: number; expense: number }>();
    for (const r of rows) {
      const item = map.get(r.day) ?? { income: 0, expense: 0 };
      if (r.type === "INCOME") item.income += Number(r.total);
      else item.expense += Number(r.total);
      map.set(r.day, item);
    }

    const round = (n: number) => Math.round(n * 100) / 100;
    const result = [...map].map(([day, v]) => ({
      day, // "2026-10-17"
      income: round(v.income),
      expense: round(v.expense),
      net: round(v.income - v.expense),
    }));

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    console.error("GET /api/v1/transactions/summary/daily failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
