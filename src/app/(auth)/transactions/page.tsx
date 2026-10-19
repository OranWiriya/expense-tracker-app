"use client";

import { TransactionsTable } from "@/features/transactions/components";
import { getColumns } from "@/features/transactions/components/Columns";

import { useTransactionList } from "@/hooks/useTransaction";
import { useWalletList } from "@/hooks/useWallet";
import { useMemo } from "react";

export default function TransactionsPage() {
  const transactions = useTransactionList();
  const { data: wallets = [] } = useWalletList();

  const walletNameById = useMemo(
    () => new Map(wallets.map((w) => [w.id, w.name])),
    [wallets],
  );
  const columns = useMemo(() => getColumns(walletNameById), [walletNameById]);

  return (
    <div className="p-3">
      <TransactionsTable
        columns={columns}
        data={transactions.data || []}
        walletNameById={walletNameById}
      />
    </div>
  );
}
