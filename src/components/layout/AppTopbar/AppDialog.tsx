import { Control, Controller, Resolver, useForm } from "react-hook-form";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppMultipleSelect from "./AppMultipleSelect";
import AppDatePicker from "./AppDatePicker";
import { accountItems, expenseItems, IncomeItems } from "./topbar-data";
import {
  TransactionFormValues,
  transactionInputSchema,
} from "@/schemas/transaction.schema";
import { useTransactionStore } from "@/store";
import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { formatNumberWithCommas, stripCommas } from "@/lib/format-number";

const renderField = ({
  type,
  name,
  control,
  transactionType,
}: {
  type: string;
  name: keyof TransactionFormValues;
  control: Control<TransactionFormValues>;
  transactionType: "expense" | "income";
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        switch (type) {
          case "number": {
            return (
              <>
                <Input
                  {...field}
                  type="text"
                  inputMode="decimal"
                  id={field.name}
                  value={
                    field.value
                      ? formatNumberWithCommas(String(field.value))
                      : ""
                  }
                  onChange={(e) => {
                    const raw = stripCommas(e.target.value);
                    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                      field.onChange(raw); // เก็บใน form state แบบไม่มี comma
                    }
                  }}
                  placeholder="Plese Enter amount number"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            );
          }
          case "select": {
            let itemData: { value: string; label: string }[] = [];
            if (name === "walletId") itemData = accountItems;
            if (name === "categoryId") {
              itemData =
                transactionType === "expense" ? expenseItems : IncomeItems;
            }
            return (
              <>
                <Select
                  items={itemData}
                  value={(field.value as string) ?? ""}
                  onValueChange={(val) => field.onChange(val ?? "")}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectGroup>
                      <SelectLabel>
                        {name === "walletId" ? "Wallet" : "Catagory"}
                      </SelectLabel>
                      {itemData.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            );
          }
          case "multi-select": {
            return (
              <AppMultipleSelect
                value={field.value as string[]}
                onChange={field.onChange}
              />
            );
          }
          case "date": {
            return (
              <>
                <AppDatePicker
                  value={field.value as string}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </>
            );
          }
          default: {
            return (
              <Input
                type="text"
                value={field.value as string}
                onChange={field.onChange}
              />
            );
          }
        }
      }}
    />
  );
};

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
                    {renderField({
                      type: field.type,
                      name: field.name,
                      control: transactionForm.control,
                      transactionType: activeTab as "expense" | "income",
                    })}
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
                    {renderField({
                      type: field.type,
                      name: field.name,
                      control: transactionForm.control,
                      transactionType: activeTab as "expense" | "income",
                    })}
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
