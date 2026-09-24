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
import {
  filterByYear,
  groupByCategory,
  groupByMonth,
} from "@/lib/transaction-calculations";
import { useTransactionStore } from "@/store";
import { useMemo } from "react";
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
  catagory: string;
  value: number;
  fill: string;
};

interface TotalGraphCardProps {
  type: "balance" | "catagory";
}

type TotalContentGraphProps =
  | { type: "balance"; chartData: barChartType[] }
  | { type: "catagory"; chartData: pieChartType[] };

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
  etc: {
    label: "etc",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const currentYear = new Date().getFullYear().toString();

const switchContentGraph = (props: TotalContentGraphProps) => {
  const { type, chartData } = props;
  switch (type) {
    case "balance": {
      const barChartData = chartData;
      console.log(barChartData);
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Total Balance Graph</CardTitle>
            <CardDescription>Show your balance graph this year</CardDescription>
          </CardHeader>
          <CardContent>
            {barChartData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full"
              >
                <BarChart accessibilityLayer data={barChartData}>
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
                  <Bar
                    dataKey="expense"
                    fill="var(--color-expense)"
                    radius={1}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <>no infomation for now</>
            )}
          </CardContent>
        </>
      );
    }
    case "catagory": {
      const pieChartData = chartData;
      return (
        <>
          <CardHeader>
            <CardTitle className="text-2xl">Catagory Graph</CardTitle>
            <CardDescription>
              explain your expense each catagory this year
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ChartContainer
                config={chartConfigPie}
                className="mx-auto aspect-square w-full "
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="catagory"
                    //this proporty deprecated but onminample still using this way so we go on like this
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
            ) : (
              <>no infomation for now</>
            )}
          </CardContent>
        </>
      );
    }
    default:
      return <>no infomation</>;
  }
};

const TotalGraphCard = (props: TotalGraphCardProps) => {
  const { type } = props;
  const transactions = useTransactionStore((s) => s.transactions);

  const transactionsThisYear = useMemo(
    () => filterByYear(transactions, currentYear),
    [transactions],
  );

  const transactionsByMonthData = useMemo(() => {
    const summaryEachMonth = groupByMonth(transactionsThisYear);
    return summaryEachMonth ?? {};
  }, [transactionsThisYear]);

  const transactionByCatagoryData = useMemo(() => {
    const summaryEachCatagory = groupByCategory(
      transactionsThisYear,
      "expense",
    );
    return summaryEachCatagory ?? {};
  }, [transactionsThisYear]);

  const barChartData: barChartType[] = Object.entries(transactionsByMonthData)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => {
      const monthName = MonthNames[key.slice(5, 7) as keyof typeof MonthNames];
      return {
        month: monthName,
        income: value.income,
        expense: value.expense,
      };
    });

  const pieChartData: pieChartType[] = Object.entries(
    transactionByCatagoryData,
  ).map(([key, value]) => ({
    catagory: key,
    value,
    fill: `var(--color-${key})`,
  }));

  const switchContentGraphProps: TotalContentGraphProps =
    type === "balance"
      ? { type: "balance", chartData: barChartData }
      : { type: "catagory", chartData: pieChartData };

  return (
    <Card className="justify-between col-span-3 row-span-2 max-xl:col-span-6 ">
      {switchContentGraph(switchContentGraphProps)}
    </Card>
  );
};

export default TotalGraphCard;
