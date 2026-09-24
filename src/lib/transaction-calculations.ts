import { Transaction } from "@/schemas/transaction.schema";

const calculateSummary = (transactions: Transaction[]) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense, balance: income - expense };
};

const groupByMonth = (transactions: Transaction[]) => {
  return transactions.reduce<
    Record<string, { income: number; expense: number }>
  >((acc, t) => {
    const month = t.date.slice(0, 7); // "2026-09"
    if (!acc[month]) acc[month] = { income: 0, expense: 0 };
    acc[month][t.type] += t.amount;
    return acc;
  }, {});
};

const groupByCategory = (
  transactions: Transaction[],
  type: "expense" | "income",
) => {
  return transactions
    .filter((t) => t.type === type)
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.categoryId] = (acc[t.categoryId] ?? 0) + t.amount;
      return acc;
    }, {});
};

const filterByYear = (transactions: Transaction[], year: string) =>
  transactions.filter((t) => t.date.slice(0, 4) === year);

export { calculateSummary, groupByMonth, groupByCategory, filterByYear };
