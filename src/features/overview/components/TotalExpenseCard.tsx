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
import { SummaryItem } from "@/hooks/useTransaction";
import {
  formatNumberByCurrency,
  responsiveTextSize,
} from "@/lib/format-number";
import { getCurrentMonth, getLastMonth } from "@/lib/utils";

interface TotalExpenseCardProps {
  data: SummaryItem[];
}

const TotalExpenseCard = (props: TotalExpenseCardProps) => {
  const { data } = props;

  const current = data.find((item) => item.period === getCurrentMonth());
  const last = data.find((item) => item.period === getLastMonth());

  const expenseLastMonth = last?.expense ?? 0;
  const expenseThisMonth = current?.expense ?? 0;

  const diffPercent = expenseLastMonth
    ? Math.round(
        ((expenseThisMonth - expenseLastMonth) / expenseLastMonth) * 100,
      )
    : null;

  const displayData = expenseThisMonth
    ? formatNumberByCurrency(expenseThisMonth)
    : "-";

  return (
    <Card className="justify-center col-span-2 row-span-1 -bg-linear-180 from-[#fdfbfb] to-red-100">
      <CardHeader>
        <CardTitle className="text-2xl text-destructive">
          Total Expense
        </CardTitle>
        <CardDescription>Show your total expense</CardDescription>
        <CardAction>
          {diffPercent !== null && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={`${diffPercent > 0 ? "destructive" : "green"}`}>
                  {diffPercent}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {diffPercent > 0
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
          {displayData}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalExpenseCard;
