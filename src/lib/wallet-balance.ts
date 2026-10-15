import { Prisma } from "@/generated/prisma/client";

export async function getWalletBalances(
  db: Prisma.TransactionClient,
  userId: string,
): Promise<Map<string, number>> {
  const txSums = await db.transaction.groupBy({
    by: ["walletId", "type"],
    where: { userId },
    _sum: { amount: true },
  });
  const transferIns = await db.transfer.groupBy({
    by: ["toWalletId"],
    where: { userId, toWalletId: { not: null } },
    _sum: { amount: true },
  });
  const transferOuts = await db.transfer.groupBy({
    by: ["fromWalletId"],
    where: { userId, fromWalletId: { not: null } },
    _sum: { amount: true },
  });

  const balanceByWallet = new Map<string, number>();
  const add = (walletId: string, value: number) =>
    balanceByWallet.set(walletId, (balanceByWallet.get(walletId) ?? 0) + value);

  for (const s of txSums) {
    const amount = Number(s._sum.amount ?? 0);
    add(s.walletId, s.type === "INCOME" ? amount : -amount);
  }
  for (const s of transferIns) {
    if (s.toWalletId) add(s.toWalletId, Number(s._sum.amount ?? 0));
  }
  for (const s of transferOuts) {
    if (s.fromWalletId) add(s.fromWalletId, -Number(s._sum.amount ?? 0));
  }

  return balanceByWallet;
}
