import { Prisma } from "@/generated/prisma/client";
import { toTransactionDto } from "@/lib/mapper";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { transactionInputSchema } from "@/schemas/transaction.schema";
import { NextResponse } from "next/server";
import { hasPrismaCode } from "../wallets/route";

export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const rows = await prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: "desc" }, { id: "desc" }],
      include: { tags: { select: { id: true, name: true } } },
      take: 100,
    });
    return NextResponse.json(
      rows.map((row) => toTransactionDto(row)),
      { status: 200 },
    );
  } catch (e) {
    console.error("GET /api/v1/transactions failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const parsed = transactionInputSchema.safeParse(
    await req.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const validatedData = parsed.data;
  const categoryId = validatedData.categoryId;

  try {
    const result = await prisma.$transaction(
      async (tx) => {
        // 1. wallet should be owned by the user
        const wallet = await tx.wallet.findFirst({
          where: { id: validatedData.walletId, userId },
          select: { id: true },
        });
        if (!wallet) return { status: "wallet_not_found" } as const;

        // 2. check tags owned by the user
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
        const created = await tx.transaction.create({
          data: {
            userId,
            walletId: wallet.id,
            category: categoryId,
            amount: validatedData.amount,
            note: validatedData.description,
            date: new Date(validatedData.date),
            type: validatedData.type,
            tags: { connect: allTagIds.map((id) => ({ id })) },
          },
          select: { id: true },
        });
        return { status: "created", id: created.id } as const;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    switch (result.status) {
      case "wallet_not_found":
        return NextResponse.json(
          { message: "Invalid wallet" },
          { status: 400 },
        );
      case "invalid_tag":
        return NextResponse.json({ message: "Invalid tag" }, { status: 400 });
      default:
        return NextResponse.json({ id: result.id }, { status: 201 });
    }
  } catch (e) {
    if (hasPrismaCode(e, "P2034")) {
      return NextResponse.json(
        { message: "Please try again" },
        { status: 409 },
      );
    }
    if (hasPrismaCode(e, "P2002")) {
      return NextResponse.json(
        { message: "Duplicate tag, please retry" },
        { status: 409 },
      );
    }
    console.error("POST /api/v1/transactions failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
