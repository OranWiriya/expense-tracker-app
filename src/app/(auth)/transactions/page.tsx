"use client";

import { TransactionsTable } from "@/features/transactions/components";
import { columns } from "@/features/transactions/components/Columns";
import { useTransactionList } from "@/hooks/useTransaction";

export default function TransactionsPage() {
  const transactions = useTransactionList();

  return (
    <div className="p-3">
      <TransactionsTable columns={columns} data={transactions.data || []} />
    </div>
  );
}
