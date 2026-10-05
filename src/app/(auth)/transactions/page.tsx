"use client";

import { TransactionsTable } from "@/features/transactions/components";
import { columns } from "@/features/transactions/components/Columns";
import { useTransactionStore } from "@/store";

export default function TransactionsPage() {
  const transactionsData = useTransactionStore((state) => state.transactions);

  return (
    <div className="p-3">
      <TransactionsTable columns={columns} data={transactionsData} />
    </div>
  );
}
