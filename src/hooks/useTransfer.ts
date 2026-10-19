import { toast } from "@/components/ui/toast";
import { http } from "@/lib/http";
import { TransferInputValues } from "@/schemas/tranfer.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { walletQueries } from "./useWallet";

interface TransferResponse {
  message: string;
}

const BASE = "/api/v1/transfers";

export const useTransfer = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: TransferInputValues) =>
      http.post<TransferResponse>(BASE, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: walletQueries.all() });
      toast.add({
        title: "Success",
        description: "Transfer added successfully",
        type: "success",
      });
    },
    onError: (error) => {
      if (error.message.includes("Insufficient")) {
        toast.add({
          title: "Error",
          description: "Account does not have enough balance",
          type: "error",
        });
        return error;
      }
      toast.add({
        title: "Error",
        description: error.message ?? "Something went wrong",
        type: "error",
      });
      return error;
    },
  });
};
