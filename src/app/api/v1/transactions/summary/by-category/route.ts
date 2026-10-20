import { toBangkokDay } from "@/lib/date-range";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import * as z from "zod";

const querySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
    .optional(), // "2026-10"
});

// (UTC+7) Bangkok "yyyy-MM"
const bangkokMonthStart = (ym: string) => new Date(`${ym}-01T00:00:00+07:00`);

const nextMonth = (ym: string) => {
  const [y, m] = ym.split("-").map(Number);
  const ny = m === 12 ? y + 1 : y;
  const nm = m === 12 ? 1 : m + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
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
  const start = bangkokMonthStart(month);
  const end = bangkokMonthStart(nextMonth(month));

  try {
    const rows = await prisma.transaction.groupBy({
      by: ["type", "category"],
      where: { userId, date: { gte: start, lt: end } },
      _sum: { amount: true },
    });

    const round = (n: number) => Math.round(n * 100) / 100;
    const toList = (type: "EXPENSE" | "INCOME") =>
      rows
        .filter((r) => r.type === type)
        .map((r) => ({
          category: r.category,
          total: round(Number(r._sum.amount ?? 0)),
        }))
        .sort((a, b) => b.total - a.total);

    return NextResponse.json(
      { month, expense: toList("EXPENSE"), income: toList("INCOME") },
      { status: 200 },
    );
  } catch (e) {
    console.error("GET /api/v1/transactions/summary/by-category failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
