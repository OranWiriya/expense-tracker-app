import { Category } from "@/generated/prisma/enums";
import * as z from "zod";

export const transactionInputSchema = z.object({
  walletId: z.string().min(1, "Select a wallet"),
  categoryId: z.enum(Category, { message: "Select a category" }).nullable(),
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  tagIds: z.array(z.string().min(1)).default([]),
  newTagNames: z
    .array(z.string().trim().min(1, "Tag name is required").max(30))
    .default([]),
  date: z.string().min(1, "Select a date"),
  description: z.string().default(""),
});

export type TransactionFormValues = z.infer<typeof transactionInputSchema>;

export const transactionSchema = transactionInputSchema
  .omit({ newTagNames: true, tagIds: true })
  .extend({
    transactionId: z.string(),
    tags: z.array(z.object({ tagId: z.string(), name: z.string() })),
  });

export type Transaction = z.infer<typeof transactionSchema>;
