"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

interface TotalGraphCardProps {
  type: "balance" | "catagory";
}

const chartData = [
  { month: "January", income: 186, expense: 80 },
  { month: "February", income: 305, expense: 200 },
  { month: "March", income: 0, expense: 0 },
  { month: "April", income: 73, expense: 0 },
  { month: "May", income: 0, expense: 130 },
  { month: "June", income: 214, expense: 140 },
  { month: "July", income: 214, expense: 140 },
  { month: "August", income: 214, expense: 140 },
  { month: "September", income: 214, expense: 140 },
  { month: "October", income: 0, expense: 0 },
  { month: "November", income: 0, expense: 0 },
  { month: "December", income: 0, expense: 0 },
];
const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-green)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartDataPie = [
  { catagory: "shopping", value: 275, fill: "var(--color-shopping)" },
  { catagory: "food", value: 200, fill: "var(--color-food)" },
  { catagory: "entertainment", value: 187, fill: "var(--color-entertainment)" },
  { catagory: "clothing", value: 173, fill: "var(--color-clothing)" },
  { catagory: "other", value: 90, fill: "var(--color-other)" },
];
const chartConfigPie = {
  value: {
    label: "Value",
  },
  shopping: {
    label: "shopping",
    color: "var(--chart-1)",
  },
  food: {
    label: "food",
    color: "var(--chart-2)",
  },
  entertainment: {
    label: "entertainment",
    color: "var(--chart-3)",
  },
  clothing: {
    label: "clothing",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const switchContentGraph = (type: TotalGraphCardProps["type"]) => {
  switch (type) {
    case "balance":
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Total Balance Graph</CardTitle>
            <CardDescription>Show your balance graph</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="income"
                  fill="var(--color-income)"
                  radius={1}
                  activeBar={{ fill: "var(--primary)" }}
                />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={1} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </>
      );
    case "catagory":
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Catagory Graph</CardTitle>
            <CardDescription>
              explain your expense each catagory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfigPie} className="mx-auto w-full ">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartDataPie}
                  dataKey="value"
                  nameKey="catagory"
                  //this proporty deprecated but on example still using this way so we go on like this
                  activeShape={{
                    fill: "var(--primary)",
                  }}
                />
                <ChartLegend
                  content={<ChartLegendContent nameKey="catagory" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </>
      );
    default:
      <>no infomation</>;
  }
};

const TotalGraphCard = (props: TotalGraphCardProps) => {
  const { type } = props;
  return (
    <Card className="justify-between col-span-3 row-span-2 max-xl:col-span-6 ">
      {switchContentGraph(type)}
    </Card>
  );
};

export default TotalGraphCard;
