import * as z from "zod";

export const CASH = "__cash__";

const walletIdSchema = z.string().min(1, "Select a wallet");

const amountSchema = z.coerce
  .number({ message: "Amount must be a number" })
  .positive("Amount must be greater than 0")
  .max(1_000_000_000, "Amount is too large");

export const transferFormSchema = z
  .object({
    fromWalletId: walletIdSchema,
    toWalletId: walletIdSchema,
    amount: amountSchema,
  })
  .superRefine((data, ctx) => {
    // validate that at least one wallet is selected
    if (!data.fromWalletId || !data.toWalletId) return;
    if (data.fromWalletId === CASH && data.toWalletId === CASH) {
      ctx.addIssue({
        code: "custom",
        message: "Select at least one wallet",
        path: ["toWalletId"],
      });
    } else if (data.fromWalletId === data.toWalletId) {
      ctx.addIssue({
        code: "custom",
        message: "Cannot transfer to the same wallet",
        path: ["toWalletId"],
      });
    }
  });

export const transferInputSchema = z
  .object({
    fromWalletId: walletIdSchema.nullable(),
    toWalletId: walletIdSchema.nullable(),
    amount: amountSchema,
  })
  .superRefine((data, ctx) => {
    if (data.fromWalletId === null && data.toWalletId === null) {
      ctx.addIssue({
        code: "custom",
        message: "At least one wallet is required",
        path: ["toWalletId"],
      });
    } else if (
      data.fromWalletId !== null &&
      data.fromWalletId === data.toWalletId
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Cannot transfer to the same wallet",
        path: ["toWalletId"],
      });
    }
  });

export type TransferFormValues = z.infer<typeof transferFormSchema>;
export type TransferInputValues = z.infer<typeof transferInputSchema>;
