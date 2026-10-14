import type { Prisma } from "@/generated/prisma/client"; // path ตาม output ของคุณ
import { Transaction } from "@/schemas/transaction.schema";

type TransactionRow = Prisma.TransactionGetPayload<{
  include: { tags: { select: { id: true } } };
}>;

export const toTransactionDto = (row: TransactionRow): Transaction => ({
  transactionId: row.id,
  walletId: row.walletId,
  categoryId: row.category,
  type: row.type as Transaction["type"],
  amount: Number(row.amount), // Decimal → number
  tagIds: row.tags.map((t) => t.id),
  date: row.date.toISOString(),
  description: row.note ?? "",
});
