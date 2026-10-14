import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { NextResponse } from "next/server";
import { hasPrismaCode } from "../route";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ walletId: string }> },
) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { walletId } = await params;
  const withTransactions =
    new URL(req.url).searchParams.get("withTransactions") === "true";

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const wallet = await tx.wallet.findFirst({
          where: { id: walletId, userId },
          select: { id: true },
        });
        if (!wallet) {
          return { status: "not_found" } as const;
        }
        const walletCount = await tx.wallet.count({ where: { userId } });
        if (walletCount <= 1) return { status: "last_wallet" } as const;

        const transactionCount = await tx.transaction.count({
          where: { walletId, userId },
        });

        if (transactionCount > 0 && !withTransactions) {
          return { status: "has_transactions", transactionCount } as const;
        }

        if (transactionCount > 0) {
          await tx.transaction.deleteMany({ where: { walletId, userId } });
        }
        await tx.wallet.delete({ where: { id: walletId } });
        return { status: "deleted" } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    switch (result.status) {
      case "not_found":
        return NextResponse.json(
          { message: "Wallet not found" },
          { status: 404 },
        );
      case "last_wallet":
        return NextResponse.json(
          { message: "You can't delete your last wallet", code: "LAST_WALLET" },
          { status: 409 },
        );
      case "has_transactions":
        return NextResponse.json(
          {
            message: `This wallet has ${result.transactionCount} transactions`,
            code: "WALLET_HAS_TRANSACTIONS",
            transactionCount: result.transactionCount,
          },
          { status: 409 },
        );
      default:
        return new NextResponse(null, { status: 204 });
    }
  } catch (e) {
    if (hasPrismaCode(e, "P2034")) {
      return NextResponse.json(
        { message: "Please try again" },
        { status: 409 },
      );
    }
    console.error("DELETE /api/v1/wallets/[walletId] failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
