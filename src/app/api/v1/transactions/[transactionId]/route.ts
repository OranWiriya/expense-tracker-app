import { toTransactionDto } from "@/lib/mapper";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { getWalletBalances } from "@/lib/wallet-balance";
import { NextResponse } from "next/server";
import { hasPrismaCode } from "../../wallets/route";
import { Prisma } from "@/generated/prisma/client";
import { transactionInputSchema } from "@/schemas/transaction.schema";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ transactionId: string }> },
) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { transactionId } = await params;

  try {
    const row = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
      include: { tags: { select: { id: true, name: true } } },
    });
    if (!row) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(toTransactionDto(row), { status: 200 });
  } catch (e) {
    console.error("GET /api/v1/transactions/[transactionId] failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ transactionId: string }> },
) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { transactionId } = await params;
  const parsed = transactionInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const validatedData = parsed.data;

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const existing = await tx.transaction.findFirst({
          where: { id: transactionId, userId },
          select: { id: true },
        });
        if (!existing) return { status: "not_found" } as const;

        const wallet = await tx.wallet.findFirst({
          where: { id: validatedData.walletId, userId },
          select: { id: true },
        });
        if (!wallet) return { status: "wallet_not_found" } as const;

        const tagIds = [...new Set(validatedData.tagIds)];
        if (tagIds.length > 0) {
          const ownedCount = await tx.tag.count({
            where: { id: { in: tagIds }, userId },
          });
          if (ownedCount !== tagIds.length)
            return { status: "invalid_tag" } as const;
        }

        const newNames = [
          ...new Set(
            validatedData.newTagNames.map((n) => n.trim().toLowerCase()),
          ),
        ];
        const createdIds: string[] = [];
        for (const name of newNames) {
          const tag = await tx.tag.upsert({
            where: { userId_name: { userId, name } },
            update: {},
            create: { userId, name },
            select: { id: true },
          });
          createdIds.push(tag.id);
        }
        const allTagIds = [...new Set([...tagIds, ...createdIds])];

        const balances = await getWalletBalances(tx, userId);
        const old = await tx.transaction.findUniqueOrThrow({
          where: { id: transactionId },
          select: { walletId: true, type: true, amount: true },
        });
        const signed = (type: string, amount: number) =>
          type === "INCOME" ? amount : -amount;

        const after = new Map(balances);
        const oldEffect = signed(old.type, Number(old.amount));
        after.set(old.walletId, (after.get(old.walletId) ?? 0) - oldEffect);
        after.set(
          validatedData.walletId,
          (after.get(validatedData.walletId) ?? 0) +
            signed(validatedData.type, validatedData.amount),
        );
        const affected = new Set([old.walletId, validatedData.walletId]);
        for (const id of affected) {
          if ((after.get(id) ?? 0) < 0)
            return { status: "negative_balance" } as const;
        }
        const updated = await tx.transaction.update({
          where: { id: transactionId },
          data: {
            walletId: validatedData.walletId,
            category: validatedData.categoryId,
            type: validatedData.type,
            amount: new Prisma.Decimal(validatedData.amount),
            note: validatedData.description,
            date: new Date(validatedData.date),
            tags: { set: allTagIds.map((id) => ({ id })) },
          },
          include: { tags: { select: { id: true, name: true } } },
        });
        return { status: "updated", transaction: updated } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    switch (result.status) {
      case "not_found":
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 },
        );
      case "wallet_not_found":
        return NextResponse.json(
          { message: "Invalid wallet" },
          { status: 400 },
        );
      case "invalid_tag":
        return NextResponse.json({ message: "Invalid tag" }, { status: 400 });
      case "negative_balance":
        return NextResponse.json(
          { message: "This change would make the balance negative" },
          { status: 409 },
        );
      default:
        return NextResponse.json(toTransactionDto(result.transaction), {
          status: 200,
        });
    }
  } catch (e) {
    if (hasPrismaCode(e, "P2034")) {
      return NextResponse.json(
        { message: "Please try again" },
        { status: 409 },
      );
    }
    console.error("PATCH /api/v1/transactions/[transactionId] failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ transactionId: string }> },
) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { transactionId } = await params;

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const transaction = await tx.transaction.findFirst({
          where: { id: transactionId, userId },
        });
        if (!transaction) return { status: "not_found" } as const;

        if (transaction.type === "INCOME") {
          const balances = await getWalletBalances(tx, userId);
          const current = balances.get(transaction.walletId) ?? 0;
          const after = current - Number(transaction.amount);
          if (after < 0) return { status: "negative_balance" } as const;
        }

        await tx.transaction.deleteMany({ where: { id: transactionId } });
        return { status: "deleted" } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    switch (result.status) {
      case "not_found":
        return NextResponse.json(
          { message: "Transaction not found" },
          { status: 404 },
        );
      case "negative_balance":
        return NextResponse.json(
          { message: "Negative balance" },
          { status: 409 },
        );
      case "deleted":
        return new NextResponse(null, { status: 204 });
      default:
        return NextResponse.json(
          { message: "Internal server error" },
          { status: 500 },
        );
    }
  } catch (e) {
    if (hasPrismaCode(e, "P2034")) {
      return NextResponse.json(
        { message: "Please try again" },
        { status: 409 },
      );
    }
    if (hasPrismaCode(e, "P2025")) {
      return NextResponse.json(
        { message: "Transaction not found" },
        { status: 404 },
      );
    }
    console.error("DELETE /api/v1/transactions/[transactionId] failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
