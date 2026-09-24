"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatNumberWithCommas,
  responsiveTextSize,
} from "@/lib/format-number";
import { groupByMonth } from "@/lib/transaction-calculations";
import { getCurrentMonth } from "@/lib/utils";
import { useTransactionStore } from "@/store";
import { useMemo } from "react";

const BalanceCard = () => {
  const { transactions } = useTransactionStore();

  const balance = useMemo(() => {
    const transactionDataEachMonth = groupByMonth(transactions);

    return (
      (transactionDataEachMonth[getCurrentMonth()]?.income ?? 0) -
      (transactionDataEachMonth[getCurrentMonth()]?.expense ?? 0)
    );
  }, [transactions]);

  const displayData = formatNumberWithCommas(balance.toLocaleString());

  return (
    <Card className="justify-center col-span-2 row-span-1 -bg-linear-180 from-[#fdfbfb] to-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl text-primary-foreground">
          Current Balance
        </CardTitle>
        <CardDescription>Show your current balance</CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className={
            responsiveTextSize(displayData) +
            "font-bold text-primary-foreground"
          }
        >
          {displayData || "-"}
        </p>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
