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

const TotalIncomeCard = () => {
  return (
    <Card className="justify-center col-span-2 row-span-1">
      <CardHeader>
        <CardTitle className="text-2xl">Total Income</CardTitle>
        <CardDescription>Show your total income</CardDescription>
        <CardAction>
          <Badge variant="green">+10%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-6xl font-bold text-green-500">$1,000 </p>
      </CardContent>
    </Card>
  );
};

export default TotalIncomeCard;
