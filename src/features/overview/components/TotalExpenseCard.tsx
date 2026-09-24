"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatNumberWithCommas,
  responsiveTextSize,
} from "@/lib/format-number";
import { groupByMonth } from "@/lib/transaction-calculations";
import { getCurrentMonth, getLastMonth } from "@/lib/utils";
import { useTransactionStore } from "@/store";
import { useMemo } from "react";

const TotalExpenseCard = () => {
  const { transactions } = useTransactionStore();

  const expenseData = useMemo(() => {
    const summaryEachMonth = groupByMonth(transactions);

    return summaryEachMonth ?? 0;
  }, [transactions]);

  const expenseLastMonth = expenseData[getLastMonth()]?.expense ?? 0;
  const expenseThisMonth = expenseData[getCurrentMonth()]?.expense ?? 0;

  const differantPercent = expenseLastMonth
    ? Math.round(
        ((expenseThisMonth - expenseLastMonth) / expenseLastMonth) * 100,
      )
    : 0;
  console.log(differantPercent);
  const displayData = expenseThisMonth
    ? formatNumberWithCommas(expenseThisMonth.toLocaleString())
    : "-";

  return (
    <Card className="justify-center col-span-2 row-span-1 -bg-linear-180 from-[#fdfbfb] to-red-100">
      <CardHeader>
        <CardTitle className="text-2xl text-destructive">
          Total Expense
        </CardTitle>
        <CardDescription>Show your total expense</CardDescription>
        <CardAction>
          {differantPercent !== 0 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={differantPercent > 0 ? "destructive" : "green"}>
                  {differantPercent}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {differantPercent > 0
                  ? "Using more than last month"
                  : "Using less than last month"}
              </TooltipContent>
            </Tooltip>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <p
          className={responsiveTextSize(displayData) + "font-bold wrap-normal"}
        >
          {displayData || "-"}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalExpenseCard;
