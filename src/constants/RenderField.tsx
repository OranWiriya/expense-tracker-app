import AppDatePicker from "@/components/layout/AppTopbar/AppDatePicker";
import AppMultipleSelect from "@/components/layout/AppTopbar/AppMultipleSelect";
import {
  accountItems,
  expenseItems,
  IncomeItems,
} from "@/components/layout/AppTopbar/topbar-data";
import { FieldError } from "@/components/ui/field";
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
import { formatNumberWithCommas, stripCommas } from "@/lib/format-number";
import { TransactionFormValues } from "@/schemas/transaction.schema";
import { Control, Controller, useWatch } from "react-hook-form";

const SELECT_LABELS = {
  walletId: "Wallet",
  categoryId: "Category",
  type: "Type",
} as const;
const RenderField = ({
  type,
  name,
  control,
  onValueChange,
}: {
  type: string;
  name: keyof TransactionFormValues;
  control: Control<TransactionFormValues>;
  onValueChange?: (val: string) => void;
}) => {
  const currentType = useWatch({ control, name: "type" });
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
                      field.onChange(raw); // collect only number
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
              itemData = currentType === "expense" ? expenseItems : IncomeItems;
            }
            if (name === "type")
              itemData = [
                {
                  value: "expense",
                  label: "Expense",
                },
                {
                  value: "income",
                  label: "Income",
                },
              ];
            return (
              <>
                <Select
                  items={itemData}
                  value={(field.value as string) ?? ""}
                  onValueChange={(val) => {
                    field.onChange(val ?? "");
                    onValueChange?.(val ?? "");
                  }}
                >
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    <SelectGroup>
                      <SelectLabel>
                        {SELECT_LABELS[name as keyof typeof SELECT_LABELS]}
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

export default RenderField;
