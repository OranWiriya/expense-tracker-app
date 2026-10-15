import { http } from "@/lib/http";
import { Transaction, TransactionPayload } from "@/schemas/transaction.schema";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { tagQueries } from "./useTag";
import { walletQueries } from "./useWallet";
import { toast } from "@/components/ui/toast";

const BASE = "/api/v1/transactions";

export const transactionQueries = {
  all: () => ["transactions"] as const,
  list: () =>
    queryOptions({
      queryKey: [...transactionQueries.all(), "list"],
      queryFn: () => http.get<Transaction[]>(BASE),
    }),
  detail: (transactionId: string) =>
    queryOptions({
      queryKey: [...transactionQueries.all(), "detail"],
      queryFn: () => http.get<Transaction>(`${BASE}/${transactionId}`),
    }),
};

export const useTransactionList = () => useQuery(transactionQueries.list());

export const useTransactionDetail = (transactionId: string) => {
  return useQuery(transactionQueries.detail(transactionId));
};

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: TransactionPayload) =>
      http.post<Transaction>(BASE, values),
    onSuccess: () => (
      qc.invalidateQueries({ queryKey: transactionQueries.all() }),
      qc.invalidateQueries({ queryKey: tagQueries.all() })
    ),
  });
};

export const useDeleteTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) =>
      http.delete<void>(`${BASE}/${transactionId}`),
    onSuccess: () => (
      qc.invalidateQueries({ queryKey: transactionQueries.all() }),
      qc.invalidateQueries({ queryKey: walletQueries.all() }),
      toast.add({
        title: "Success",
        description: "Transaction deleted",
        type: "success",
      })
    ),
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message ?? "Something went wrong",
        type: "error",
      });
    },
  });
};
