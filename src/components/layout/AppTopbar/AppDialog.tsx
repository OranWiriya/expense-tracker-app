import { useForm } from "react-hook-form";
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
  TransactionFormInput,
  TransactionFormOutput,
  transactionFormSchema,
  transactionInputSchema,
} from "@/schemas/transaction.schema";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import RenderField from "@/constants/RenderField";
import { useCreateTransaction } from "@/hooks/useTransaction";
import { useWalletList } from "@/hooks/useWallet";
import { walletsToSelectItems } from "@/lib/select-options";
import { TransactionType } from "@/generated/prisma/enums";
const expenseHeader = {
  Title: "Expense Amount",
  SubTitle: "Make a Expense",
};

const incomeHeader = {
  Title: "Income Amount",
  SubTitle: "Make a Income",
};

const defaultValues: TransactionFormInput = {
  walletId: "",
  categoryId: null,
  type: "EXPENSE",
  amount: 0,
  tagIds: [],
  newTagNames: [],
  date: "",
  description: "",
};

const fieldConfig: {
  name: keyof TransactionFormInput;
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
  const [activeTab, setActiveTab] = useState<TransactionType>("EXPENSE");
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { data: wallets } = useWalletList();
  const transactionForm = useForm<
    TransactionFormInput,
    unknown,
    TransactionFormOutput
  >({
    resolver: zodResolver(transactionFormSchema),
    defaultValues,
  });

  const resetDialog = () => {
    transactionForm.reset();
    setActiveTab("EXPENSE");
  };

  const handleTabChange = (tab: string) => {
    const nextType = tab as "EXPENSE" | "INCOME";
    setActiveTab(nextType);
    transactionForm.setValue("type", nextType, { shouldValidate: false });
    transactionForm.setValue("categoryId", null, {
      shouldValidate: false,
    });
  };

  const onSubmitTransaction = transactionForm.handleSubmit((values) => {
    const verifiedValue = transactionInputSchema.parse(values);
    createTransaction(verifiedValue, {
      onSuccess: () => {
        resetDialog();
        toast.add({
          title: "Success",
          description: "Transaction added successfully",
          type: "success",
        });
        setOpen(false);
      },
      onError: (e) => {
        toast.add({
          title: "Error",
          description: e.message ?? "Something went wrong",
          type: "error",
        });
      },
    });
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          resetDialog();
        }
      }}
    >
      <DialogTrigger
        render={<Button className={"cursor-pointer"}>Transcation +</Button>}
      />
      <DialogContent className="sm:max-w-sm">
        <form id="transaction-form" onSubmit={onSubmitTransaction}>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="EXPENSE">Expense</TabsTrigger>
              <TabsTrigger value="INCOME">Income</TabsTrigger>
            </TabsList>
            <TabsContent value="EXPENSE">
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
                      itemDatas={walletsToSelectItems(wallets || [])}
                      onNewTagNamesChange={transactionForm.setValue}
                    />
                  </Field>
                ))}
              </FieldGroup>
            </TabsContent>

            <TabsContent value="INCOME">
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
                      itemDatas={walletsToSelectItems(wallets || [])}
                      onNewTagNamesChange={transactionForm.setValue}
                    />
                  </Field>
                ))}
              </FieldGroup>
            </TabsContent>
          </Tabs>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit" form="transaction-form" disabled={isPending}>
            {isPending ? "Saving..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;
