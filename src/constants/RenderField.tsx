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
import { SelectItemType } from "@/lib/select-options";
import {
  TransactionFormInput,
  TransactionFormOutput,
} from "@/schemas/transaction.schema";
import {
  Control,
  Controller,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";

const SELECT_LABELS = {
  walletId: "Wallet",
  categoryId: "Category",
  type: "Type",
} as const;
const RenderField = ({
  type,
  name,
  control,
  itemDatas,
  onValueChange,
  onNewTagNamesChange,
}: {
  type: string;
  name: keyof TransactionFormInput;
  control: Control<TransactionFormInput, unknown, TransactionFormOutput>;
  itemDatas?: SelectItemType[];
  onValueChange?: (val: string | null) => void;
  onNewTagNamesChange?: UseFormSetValue<TransactionFormInput>;
}) => {
  const currentType = useWatch({ control, name: "type" });
  const newTagNames = useWatch({ control, name: "newTagNames" }) ?? [];
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
            let itemDataDefualt: SelectItemType[] = [];
            if (name === "walletId")
              itemDataDefualt = itemDatas ?? accountItems;
            if (name === "categoryId") {
              itemDataDefualt =
                currentType === "EXPENSE" ? expenseItems : IncomeItems;
            }
            if (name === "type")
              itemDataDefualt = [
                {
                  value: "EXPENSE",
                  label: "Expense",
                },
                {
                  value: "INCOME",
                  label: "Income",
                },
              ];
            const items = itemDataDefualt;
            return (
              <>
                <Select
                  items={items}
                  value={(field.value as string) ?? ""}
                  onValueChange={(val) => {
                    field.onChange(val ?? null);
                    onValueChange?.(val ?? null);
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
                      {items.map((item) => (
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
                newTagNames={newTagNames}
                onNewTagNamesChange={(name) =>
                  onNewTagNamesChange?.("newTagNames", name)
                }
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
