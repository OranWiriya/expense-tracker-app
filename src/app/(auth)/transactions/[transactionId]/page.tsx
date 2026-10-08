import { TransactionDetail } from "@/features/transactionsDetail/components/";

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const { transactionId } = await params;

  return (
    <TransactionDetail
      key={transactionId}
      transactionId={String(transactionId)}
    />
  );
}
