"use client";

import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategorySummary, SummaryItem } from "@/hooks/useTransaction";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";

const MonthNames = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

type barChartType = {
  month: string;
  income: number;
  expense: number;
};
type pieChartType = {
  category: string;
  value: number;
  fill: string;
};

type CategoryKind = "expense" | "income";

interface TotalGraphCardProps {
  type: "balance" | "category";
  summaryDatas?: SummaryItem[];
  categoryData?: CategorySummary;
}

interface GraphContentProps {
  type: "balance" | "category";
  barData: barChartType[];
  pieData: pieChartType[];
  categoryType: CategoryKind;
}
const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-6)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const expenseConfig = {
  food: { label: "food", color: "var(--chart-2)" },
  entertainment: { label: "entertainment", color: "var(--chart-3)" },
  clothing: { label: "clothing", color: "var(--chart-4)" },
  etc: { label: "etc", color: "var(--chart-5)" },
} satisfies ChartConfig;

const incomeConfig = {
  salary: { label: "salary", color: "var(--chart-6)" },
  gift: { label: "gift", color: "var(--chart-7)" },
  etc: { label: "etc", color: "var(--chart-8)" },
} satisfies ChartConfig;

const chartConfigPie: Record<CategoryKind, ChartConfig> = {
  expense: expenseConfig,
  income: incomeConfig,
};

const GraphContent = (props: GraphContentProps) => {
  const { type, barData, pieData, categoryType } = props;
  switch (type) {
    case "balance": {
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Total Balance Graph</CardTitle>
            <CardDescription>Show your balance graph this year</CardDescription>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="mx-auto min-h-64 w-full"
              >
                <BarChart accessibilityLayer data={barData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={5}
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
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={1}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <>no information for now</>
            )}
          </CardContent>
        </>
      );
    }
    case "category": {
      return (
        <>
          <CardContent>
            {pieData.length > 0 ? (
              <ChartContainer
                config={chartConfigPie[categoryType]}
                className="mx-auto w-full "
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="category"
                    //this proporty deprecated but onminample still using this way so we go on like this
                    activeShape={{
                      fill: "var(--primary)",
                    }}
                  />
                  <ChartLegend
                    content={<ChartLegendContent nameKey="category" />}
                    className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <>no information for now</>
            )}
          </CardContent>
        </>
      );
    }
    default:
      return <>no information</>;
  }
};

const TotalGraphCard = (props: TotalGraphCardProps) => {
  const { type, summaryDatas, categoryData } = props;
  const [categoryType, setCategoryType] = useState<"expense" | "income">(
    "expense",
  );

  const barChartData: barChartType[] | undefined =
    summaryDatas &&
    summaryDatas.map((item) => {
      const monthName =
        MonthNames[item.period.slice(5, 7) as keyof typeof MonthNames];
      return {
        month: monthName,
        income: item.income,
        expense: item.expense,
      };
    });

  const expensePieChartData: pieChartType[] | undefined =
    categoryData?.expense.map((item) => ({
      category: item.category,
      value: item.total,
      fill: `var(--color-${item.category})`,
    }));
  const incomePieChartData: pieChartType[] | undefined =
    categoryData?.income.map((item) => ({
      category: item.category,
      value: item.total,
      fill: `var(--color-${item.category})`,
    }));

  const pieChartData =
    categoryType === "expense" ? expensePieChartData : incomePieChartData;

  return (
    <Card className="justify-between col-span-3 max-xl:col-span-6">
      {type === "category" && (
        <CardHeader>
          <CardTitle className="text-2xl">Category Graph</CardTitle>
          <CardDescription>
            <span className="block">
              Category:{" "}
              <span className="font-bold text-primary-foreground">
                {categoryType.toUpperCase()}
              </span>
            </span>
            explain your expense each category this month
          </CardDescription>
          <CardAction>
            <Select
              value={categoryType}
              onValueChange={(v) =>
                v && setCategoryType(v as "expense" | "income")
              }
            >
              <SelectTrigger>
                <SelectValue>Select Category</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
      )}
      <GraphContent
        barData={barChartData ?? []}
        pieData={pieChartData ?? []}
        type={type}
        categoryType={categoryType}
      />
    </Card>
  );
};

export default TotalGraphCard;
