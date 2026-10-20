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

interface TotalIncomeCardProps {
  data: SummaryItem[];
}

const TotalIncomeCard = (props: TotalIncomeCardProps) => {
  const { data } = props;

  const current = data.find((item) => item.period === getCurrentMonth());
  const last = data.find((item) => item.period === getLastMonth());

  const incomeLastMonth = last?.income ?? 0;
  const incomeThisMonth = current?.income ?? 0;

  const diffPercent = incomeLastMonth
    ? Math.round(((incomeThisMonth - incomeLastMonth) / incomeLastMonth) * 100)
    : null;

  const displayData = incomeThisMonth
    ? formatNumberByCurrency(incomeThisMonth)
    : "-";

  return (
    <Card className="justify-center col-span-2 row-span-1 -bg-linear-180 from-[#fdfbfb] to-green-50">
      <CardHeader>
        <CardTitle className="text-2xl text-green-500">Total Income</CardTitle>
        <CardDescription>Show your total income</CardDescription>
        <CardAction>
          {diffPercent !== null && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={diffPercent > 0 ? "green" : "destructive"}>
                  {diffPercent}%
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {diffPercent > 0
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
