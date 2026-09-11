"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BalanceCard = () => {
  return (
    <Card className="justify-center col-span-2 row-span-1">
      <CardHeader>
        <CardTitle className="text-2xl">Current Balance</CardTitle>
        <CardDescription>Show your current balance</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-6xl font-bold text-primary">$5,000</p>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
