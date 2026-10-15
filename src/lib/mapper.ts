import type { Prisma } from "@/generated/prisma/client"; // path ตาม output ของคุณ
import { Transaction } from "@/schemas/transaction.schema";

type TransactionRow = Prisma.TransactionGetPayload<{
  include: { tags: { select: { id: true; name: true } } };
}>;

export const toTransactionDto = (row: TransactionRow): Transaction => ({
  transactionId: row.id,
  walletId: row.walletId,
  categoryId: row.category,
  type: row.type,
  amount: Number(row.amount), // Decimal → number
  tags: row.tags.map((t) => ({ tagId: t.id, name: t.name })),
  date: row.date.toISOString(),
  description: row.note ?? "",
});
