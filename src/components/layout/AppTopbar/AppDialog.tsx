import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TransactionFormValues,
  transactionInputSchema,
} from "@/schemas/transaction.schema";
import { useTransactionStore } from "@/store";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import RenderField from "@/constants/RenderField";

const expenseHeader = {
  Title: "Expense Amount",
  SubTitle: "Make a Expense",
};

const incomeHeader = {
  Title: "Income Amount",
  SubTitle: "Make a Income",
};

const defaultValues: TransactionFormValues = {
  walletId: "",
  categoryId: "",
  type: "expense",
  amount: 0,
  tagIds: [],
  date: "",
  description: "",
};

const fieldConfig: {
  name: keyof TransactionFormValues;
  label: string;
  type: string;
}[] = [
  { name: "amount" as const, label: "Amount", type: "number" },
  { name: "categoryId" as const, label: "Category", type: "select" },
  { name: "tagIds" as const, label: "Tag", type: "multi-select" },
  { name: "walletId" as const, label: "Wallet", type: "select" },
  { name: "date" as const, label: "Date", type: "date" },
  { name: "description" as const, label: "Description", type: "text" },
];

const AppDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("expense");
  const { addTransaction } = useTransactionStore();
  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(
      transactionInputSchema,
    ) as Resolver<TransactionFormValues>,
    defaultValues,
  });

  const handleTabChange = (tab: string) => {
    const nextType = tab as "expense" | "income";
    setActiveTab(nextType);
    transactionForm.setValue("type", nextType, { shouldValidate: false });
    transactionForm.setValue("categoryId", "", {
      shouldValidate: false,
    });
  };

  const onSubmitTransaction = transactionForm.handleSubmit((values) => {
    addTransaction(values);
    transactionForm.reset();
    setActiveTab("expense");
    setOpen(false);
    toast.add({
      title: "Success",
      description: "Transaction added successfully",
      type: "success",
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button className={"cursor-pointer"}>Transcation +</Button>}
      />
      <DialogContent className="sm:max-w-sm">
        <form id="trasaction-form" onSubmit={onSubmitTransaction}>
          <Tabs
            defaultValue="expense"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="expense">Expense</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
            </TabsList>
            <TabsContent value="expense">
              <DialogHeader className={"py-4"}>
                <DialogTitle>{expenseHeader.Title}</DialogTitle>
                <DialogDescription>{expenseHeader.SubTitle}</DialogDescription>
              </DialogHeader>
              <FieldGroup className="gap-2">
                {fieldConfig.map((field) => (
                  <Field key={field.name} className="gap-1">
                    <FieldLabel htmlFor={field.name}>
                      {field.label}{" "}
                      {field.name === "tagIds" ||
                      field.name === "description" ? (
                        ""
                      ) : (
                        <span className="text-destructive">*</span>
                      )}
                    </FieldLabel>
                    <RenderField
                      type={field.type}
                      name={field.name}
                      control={transactionForm.control}
                    />
                  </Field>
                ))}
              </FieldGroup>
            </TabsContent>

            <TabsContent value="income">
              <DialogHeader className={"py-4"}>
                <DialogTitle>{incomeHeader.Title}</DialogTitle>
                <DialogDescription>{incomeHeader.SubTitle}</DialogDescription>
              </DialogHeader>
              <FieldGroup className="gap-2">
                {fieldConfig.map((field) => (
                  <Field key={field.name} className="gap-1">
                    <FieldLabel htmlFor={field.name}>
                      {field.label}{" "}
                      {field.name === "tagIds" ||
                      field.name === "description" ? (
                        ""
                      ) : (
                        <span className="text-destructive">*</span>
                      )}
                    </FieldLabel>
                    <RenderField
                      type={field.type}
                      name={field.name}
                      control={transactionForm.control}
                    />
                  </Field>
                ))}
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="trasaction-form">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
