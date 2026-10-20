"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SummaryItem } from "@/hooks/useTransaction";
import {
  formatNumberByCurrency,
  responsiveTextSize,
} from "@/lib/format-number";
import { getCurrentMonth } from "@/lib/utils";

interface NetCardProps {
  data: SummaryItem[];
}

const NetCard = (props: NetCardProps) => {
  const { data } = props;

  const current = data.find((item) => item.period === getCurrentMonth());
  const net = current?.net ?? 0;

  const displayData = net ? formatNumberByCurrency(net) : "-";

  return (
    <Card className="justify-center col-span-2 row-span-1 -bg-linear-180 from-[#fdfbfb] to-primary/50">
      <CardHeader>
        <CardTitle className="text-2xl text-primary-foreground">
          Current Net
        </CardTitle>
        <CardDescription>Show your net this month</CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className={
            responsiveTextSize(displayData) +
            "font-bold text-primary-foreground"
          }
        >
          {displayData}
        </p>
      </CardContent>
    </Card>
  );
};

export default NetCard;
