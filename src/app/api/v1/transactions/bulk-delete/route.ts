import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { getWalletBalances } from "@/lib/wallet-balance";
import { NextResponse } from "next/server";
import * as z from "zod";
import { hasPrismaCode } from "../../wallets/route";

const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1).max(100),
});

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = bulkDeleteSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  const ids = [...new Set(parsed.data.ids)];

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const rows = await tx.transaction.findMany({
          where: { id: { in: ids }, userId },
          select: { id: true, walletId: true, type: true, amount: true },
        });
        if (rows.length !== ids.length) return { status: "not_found" } as const;

        // ผลสุทธิต่อ wallet หลังลบ
        const delta = new Map<string, number>();
        for (const r of rows) {
          const effect =
            r.type === "INCOME" ? -Number(r.amount) : Number(r.amount);
          delta.set(r.walletId, (delta.get(r.walletId) ?? 0) + effect);
        }

        const balances = await getWalletBalances(tx, userId);
        for (const [walletId, change] of delta) {
          if (change < 0 && (balances.get(walletId) ?? 0) + change < 0)
            return { status: "negative_balance" } as const;
        }

        await tx.transaction.deleteMany({ where: { id: { in: ids }, userId } });
        return { status: "deleted", count: rows.length } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    switch (result.status) {
      case "not_found":
        return NextResponse.json(
          { message: "Some transactions were not found" },
          { status: 404 },
        );
      case "negative_balance":
        return NextResponse.json(
          { message: "Deleting these would make a balance negative" },
          { status: 409 },
        );
      default:
        return NextResponse.json({ count: result.count }, { status: 200 });
    }
  } catch (e) {
    if (hasPrismaCode(e, "P2034"))
      return NextResponse.json(
        { message: "Please try again" },
        { status: 409 },
      );
    console.error("POST /api/v1/transactions/bulk-delete failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
