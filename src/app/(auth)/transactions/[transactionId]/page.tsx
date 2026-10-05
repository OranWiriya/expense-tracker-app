"use client";

import { useParams } from "next/navigation";

export default function TransactionDetailPage() {
  const params = useParams();

  return (
    <div>
      TransactionDetailPage + <span>{params.transactionId}</span>
    </div>
  );
}
