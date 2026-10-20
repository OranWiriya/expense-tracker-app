"use client";

import {
  NetCard,
  TotalExpenseCard,
  TotalGraphCard,
  TotalIncomeCard,
} from "@/features/overview/components";
import {
  useCategorySummary,
  useTransactionSummary,
} from "@/hooks/useTransaction";
import { toBangkokDay } from "@/lib/date-range";
import { useMemo } from "react";

export default function OverviewPage() {
  const year = Number(toBangkokDay(new Date().toISOString()).slice(0, 4));
  const { data: transactionSummary, isLoading } = useTransactionSummary(
    "month",
    year,
  );
  const { data: categorySummary, isLoading: catagoryLoading } =
    useCategorySummary();

  const data = useMemo(() => {
    const months = Array.from(
      { length: 12 },
      (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`,
    );
    return months.map(
      (m) =>
        transactionSummary?.find((s) => s.period === m) ?? {
          period: m,
          income: 0,
          expense: 0,
          net: 0,
        },
    );
  }, [year, transactionSummary]);

  if (isLoading || catagoryLoading) return <>loading...</>;
  console.log(categorySummary);

  return (
    <div className="grid grid-cols-6  gap-4 p-3 bg-primary/10 h-full">
      <NetCard data={data} />
      <TotalExpenseCard data={data} />
      <TotalIncomeCard data={data} />

      <TotalGraphCard type="category" categoryData={categorySummary} />
      <TotalGraphCard type="balance" summaryDatas={data} />
    </div>
  );
}
