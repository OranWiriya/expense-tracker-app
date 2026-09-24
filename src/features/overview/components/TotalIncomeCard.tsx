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

const TotalIncomeCard = () => {
  const { transactions } = useTransactionStore();

  const IncomeData = useMemo(() => {
    const summaryEachMonth = groupByMonth(transactions);

    return summaryEachMonth ?? 0;
  }, [transactions]);

  const incomeLastMonth = IncomeData[getLastMonth()]?.income ?? 0;
  const incomeThisMonth = IncomeData[getCurrentMonth()]?.income ?? 0;

  const differantPercent = incomeLastMonth
    ? Math.round(((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100)
    : 0;
  console.log(differantPercent);
  const displayData = incomeThisMonth
    ? formatNumberWithCommas(incomeThisMonth.toLocaleString())
    : "-";

  return (
    <Card className="justify-center col-span-2 row-span-1 -bg-linear-180 from-[#fdfbfb] to-green-50">
      <CardHeader>
        <CardTitle className="text-2xl text-green-500">Total Income</CardTitle>
        <CardDescription>Show your total income</CardDescription>
        <CardAction>
          {differantPercent !== 0 && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={differantPercent > 0 ? "green" : "destructive"}>
                  {differantPercent}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {differantPercent > 0
                  ? "Received more than last month"
                  : "Received less than last month"}
              </TooltipContent>
            </Tooltip>
          )}
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className={responsiveTextSize(displayData) + "font-bold"}>
          {displayData || "-"}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalIncomeCard;
