"use client";

import { TransactionDetail } from "@/features/transactionsDetail/components";
import { useParams } from "next/navigation";

export default function TransactionDetailPage() {
  const params = useParams();

  return (
    <>
      <TransactionDetail transactionId={String(params.transactionId)} />
    </>
  );
}
