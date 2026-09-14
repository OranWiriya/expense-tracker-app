import { TransactionsTable } from "@/features/transactions/components";
import { columns } from "@/features/transactions/components/Columns";
import { getData } from "@/features/transactions/components/mocks/transactions-data";

export default async function TransactionsPage() {
  const data = await getData();
  return (
    <div>
      <TransactionsTable columns={columns} data={data} />
    </div>
  );
}
