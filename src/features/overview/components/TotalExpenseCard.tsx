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

const TotalExpenseCard = () => {
  return (
    <Card className="justify-center col-span-2 row-span-1">
      <CardHeader>
        <CardTitle className="text-2xl">Total Expense</CardTitle>
        <CardDescription>Show your total expense</CardDescription>
        <CardAction>
          <Badge variant="destructive">+10%</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-6xl font-bold text-red-500">$1,000 </p>
      </CardContent>
    </Card>
  );
};

export default TotalExpenseCard;
