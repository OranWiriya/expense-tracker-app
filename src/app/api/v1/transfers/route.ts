import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { transferInputSchema } from "@/schemas/tranfer.schema";
import { NextResponse } from "next/server";
import { hasPrismaCode } from "../wallets/route";

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = transferInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { fromWalletId, toWalletId, amount } = parsed.data;
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. find all wallets owned by the user
        const walletIds = [fromWalletId, toWalletId].filter(
          (id): id is string => id !== null,
        );
        const owned = await tx.wallet.findMany({
          where: { id: { in: walletIds }, userId },
          select: { id: true },
        });
        if (owned.length !== walletIds.length) {
          return { status: "not_found" } as const;
        }
        // 2. check balance from wallet
        if (fromWalletId) {
          const [txSums, transfersIn, transfersOut] = await Promise.all([
            tx.transaction.groupBy({
              by: ["type"],
              where: { walletId: fromWalletId, userId },
              _sum: { amount: true },
            }),
            tx.transfer.aggregate({
              where: { toWalletId: fromWalletId, userId },
              _sum: { amount: true },
            }),
            tx.transfer.aggregate({
              where: { fromWalletId, userId },
              _sum: { amount: true },
            }),
          ]);

          const txBalance = txSums.reduce((sum, s) => {
            const value = Number(s._sum.amount ?? 0);
            return sum + (s.type === "INCOME" ? value : -value);
          }, 0);

          const balance =
            txBalance +
            Number(transfersIn._sum.amount ?? 0) -
            Number(transfersOut._sum.amount ?? 0);

          if (balance < amount) {
            return { status: "insufficient_balance", balance } as const;
          }
        }

        // 3. create transfer
        await tx.transfer.create({
          data: {
            userId,
            fromWalletId,
            toWalletId,
            amount: new Prisma.Decimal(amount),
          },
        });
        return { status: "created" } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    switch (result.status) {
      case "not_found":
        return NextResponse.json(
          { message: "Wallet not found" },
          { status: 404 },
        );
      case "insufficient_balance":
        return NextResponse.json(
          {
            message: "Insufficient balance",
            code: "INSUFFICIENT_BALANCE",
            balance: result.balance,
          },
          { status: 409 },
        );
      default:
        return NextResponse.json(
          { message: "Transfer created" },
          { status: 201 },
        );
    }
  } catch (e) {
    if (hasPrismaCode(e, "P2034")) {
      return NextResponse.json(
        { message: "Please try again" },
        { status: 409 },
      );
    }
    console.error("POST /api/v1/transfers failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
