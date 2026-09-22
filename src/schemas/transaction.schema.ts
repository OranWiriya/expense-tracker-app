import * as z from "zod";

export const transactionInputSchema = z.object({
  walletId: z.string().min(1, "Select a wallet"),
  categoryId: z.string().min(1, "Select a category"),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  tagIds: z.array(z.string()).default([]),
  date: z.string().min(1, "Select a date"),
  description: z.string().default(""),
});

export type TransactionFormValues = z.infer<typeof transactionInputSchema>;

export const transactionSchema = transactionInputSchema.extend({
  transactionId: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;
