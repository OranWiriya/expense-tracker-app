import {
  BalanceCard,
  TotalExpenseCard,
  TotalGraphCard,
  TotalIncomeCard,
} from "@/features/overview/components";

export default function OverviewPage() {
  return (
    <div className="grid grid-cols-6 gap-4 p-3 bg-primary/10 h-full">
      <BalanceCard />
      <TotalExpenseCard />
      <TotalIncomeCard />

      <TotalGraphCard type="catagory" />
      <TotalGraphCard type="balance" />
    </div>
  );
}
