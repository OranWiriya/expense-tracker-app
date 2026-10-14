import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/session";
import { getWalletBalances } from "@/lib/wallet-balance";
import { walletInputSchema } from "@/schemas/wallet.schema";
import { NextResponse } from "next/server";

const DEFAULT_WALLET_NAME = "Account_1";

export const hasPrismaCode = (e: unknown, code: string) =>
  typeof e === "object" && e !== null && "code" in e && e.code === code;

export async function POST(req: Request) {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = walletInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const validatedData = parsed.data;

  try {
    const createdWallet = await prisma.wallet.create({
      data: {
        userId,
        name: validatedData.name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    return NextResponse.json(createdWallet, { status: 201 });
  } catch (e) {
    if (hasPrismaCode(e, "P2002")) {
      return NextResponse.json(
        { message: "A wallet with this name already exists" },
        { status: 409 },
      );
    }
    console.error("POST /api/v1/wallets failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const userId = await getUserId();
  if (!userId)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const select = { id: true, name: true, createdAt: true } as const;

  try {
    let wallets = await prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select,
    });

    if (wallets.length === 0) {
      const created = await prisma.wallet.upsert({
        where: { userId_name: { userId, name: DEFAULT_WALLET_NAME } },
        update: {},
        create: { userId, name: DEFAULT_WALLET_NAME },
        select,
      });
      wallets = [created];
    }

    const balanceByWallet = await getWalletBalances(prisma, userId);

    const result = wallets.map((w) => ({
      ...w,
      createdAt: w.createdAt.toISOString(),
      balance: Math.round((balanceByWallet.get(w.id) ?? 0) * 100) / 100,
    }));

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (e) {
    console.error("GET /api/v1/wallets failed", e);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
