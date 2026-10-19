import { Category } from "@/generated/prisma/enums";
import * as z from "zod";

const categoryMessage = { message: "Select a category" };

// using in DTO and input to server
const categoryValue = z.enum(Category, categoryMessage);

// using in input to client
export type CategoryFormValue = Category | null;

const baseFields = {
  walletId: z.string().min(1, "Select a wallet"),
  type: z.enum(["EXPENSE", "INCOME"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  tagIds: z.array(z.string().min(1)).default([]),
  newTagNames: z
    .array(z.string().trim().min(1, "Tag name is required").max(30))
    .default([]),
  date: z.iso.datetime({
    error: "Select a date",
  }),
  description: z.string().default(""),
};
// schema for form validation nullable
export const transactionFormSchema = z
  .object({
    ...baseFields,
    categoryId: categoryValue.nullable(),
  })
  .refine((d) => d.categoryId !== null, {
    message: "Select a category",
    path: ["categoryId"],
  });

// schema for input to server
export const transactionInputSchema = z.object({
  ...baseFields,
  categoryId: categoryValue,
});

// form: input = value in form (amount with be unknown cause coerce)
export type TransactionFormInput = z.input<typeof transactionFormSchema>;

// form: output = value after schema when handleSubmit
export type TransactionFormOutput = z.output<typeof transactionFormSchema>;

// value to server and api route (categoryId will not be null)
export type TransactionPayload = z.output<typeof transactionInputSchema>;

export const transactionSchema = transactionInputSchema
  .omit({ newTagNames: true, tagIds: true })
  .extend({
    transactionId: z.string(),
    tags: z.array(z.object({ tagId: z.string(), label: z.string() })),
  });

export type Transaction = z.infer<typeof transactionSchema>;
