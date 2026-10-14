import { http } from "@/lib/http";
import {
  WalletEntity,
  walletEntitySchema,
  WalletInputValues,
  WalletValues,
} from "@/schemas/wallet.schema";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { transactionQueries } from "./useTransaction";
import { toast } from "@/components/ui/toast";

const BASE = "/api/v1/wallets";

const walletQueries = {
  all: () => ["wallets"] as const,
  list: () =>
    queryOptions({
      queryKey: [...walletQueries.all(), "list"],
      queryFn: () => http.get<WalletValues[]>(BASE),
    }),
};

const useWalletList = () => useQuery(walletQueries.list());

const useCreateWallet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: WalletInputValues) => {
      const data = await http.post<unknown>(BASE, values);
      return walletEntitySchema.parse(data);
    },

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletQueries.all() });
      toast.add({
        title: "Success",
        description: "Wallet added successfully",
        type: "success",
      });
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message ?? "Something went wrong",
        type: "error",
      });
    },
  });
};

const useDeleteWallet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      walletId,
      withTransactions,
    }: {
      walletId: string;
      withTransactions?: boolean;
      title: string;
    }) =>
      http.delete(`${BASE}/${walletId}`, {
        params: withTransactions ? { withTransactions: true } : undefined,
      }),
    onSuccess: (_data, variables) => {
      Promise.all([
        qc.invalidateQueries({ queryKey: walletQueries.all() }),
        qc.invalidateQueries({ queryKey: transactionQueries.all() }),
      ]);
      toast.add({
        title: "Success",
        description: `${variables.title} wallet deleted successfully`,
        type: "success",
      });
    },

    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message ?? "Something went wrong",
        type: "error",
      });
    },
  });
};

export { useWalletList, useCreateWallet, useDeleteWallet, walletQueries };
