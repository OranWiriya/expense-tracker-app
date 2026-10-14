import { http } from "@/lib/http";
import {
  Transaction,
  TransactionFormValues,
} from "@/schemas/transaction.schema";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

const BASE = "/api/v1/transactions";

export const transactionQueries = {
  all: () => ["transactions"] as const,
  list: () =>
    queryOptions({
      queryKey: [...transactionQueries.all(), "list"],
      queryFn: () => http.get<Transaction[]>(BASE),
    }),
};

export const useTransactionList = () => useQuery(transactionQueries.list());

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: TransactionFormValues) =>
      http.post<Transaction>(BASE, values),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: transactionQueries.all() }),
  });
};
