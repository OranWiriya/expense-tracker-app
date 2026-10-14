import * as z from "zod";

export const walletInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Wallet name is required")
    .max(20, "Wallet name is too long (20 characters maximum)"),
});

export type WalletInputValues = z.infer<typeof walletInputSchema>;

export const walletEntitySchema = walletInputSchema.extend({
  id: z.string(),
  createdAt: z.string(),
});
export type WalletEntity = z.infer<typeof walletEntitySchema>;

// wallet with balance included
export const walletWithBalanceSchema = walletEntitySchema.extend({
  balance: z.number(),
});
export type WalletValues = z.infer<typeof walletWithBalanceSchema>;
