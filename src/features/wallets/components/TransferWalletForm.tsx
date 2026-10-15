import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useTransfer } from "@/hooks/useTransfer";
import { useWalletList } from "@/hooks/useWallet";
import { formatNumberWithCommas, stripCommas } from "@/lib/format-number";
import {
  CASH,
  transferFormSchema,
  TransferFormValues,
  TransferInputValues,
} from "@/schemas/tranfer.schema";
import { WalletValues } from "@/schemas/wallet.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, Resolver, useForm } from "react-hook-form";

type SelectItemType = {
  label: React.ReactNode;
  value: string;
};

interface TransferWalletFormProps {
  transferType: "deposit" | "withdraw";
  walletId: string;
  setDialog: (open: boolean) => void;
}

const toPayload = (v: TransferFormValues): TransferInputValues => ({
  fromWalletId: v.fromWalletId === CASH ? null : v.fromWalletId,
  toWalletId: v.toWalletId === CASH ? null : v.toWalletId,
  amount: v.amount,
});

const transformSelectData = (datas: WalletValues[]): SelectItemType[] => {
  return datas.map((wallet) => ({
    label: wallet.name,
    value: wallet.id,
  }));
};

const TransferWalletForm = (props: TransferWalletFormProps) => {
  const { transferType, walletId, setDialog } = props;
  const { data: wallets, isLoading, isSuccess } = useWalletList();
  const transfer = useTransfer();
  const transferForm = useForm({
    resolver: zodResolver(transferFormSchema) as Resolver<TransferFormValues>,
    defaultValues: {
      amount: 0,
      fromWalletId: "",
      toWalletId: "",
    },
    values: {
      amount: 0,
      fromWalletId: transferType === "withdraw" ? walletId : "",
      toWalletId: transferType === "deposit" ? walletId : "",
    },
  });
  let fromWalletItems: SelectItemType[] = [];
  let toWalletItems: SelectItemType[] = [];

  if (isSuccess && transferType === "deposit") {
    fromWalletItems = transformSelectData(
      wallets.filter((wallet) => wallet.id !== walletId),
    );
    toWalletItems = transformSelectData(
      wallets.filter((wallet) => wallet.id === walletId),
    );
    fromWalletItems = [
      ...fromWalletItems,
      {
        label: "Cash",
        value: CASH,
      },
    ];
  } else if (isSuccess && transferType === "withdraw") {
    fromWalletItems = transformSelectData(
      wallets.filter((wallet) => wallet.id === walletId),
    );
    toWalletItems = transformSelectData(
      wallets.filter((wallet) => wallet.id !== walletId),
    );

    toWalletItems = [
      ...toWalletItems,
      {
        label: "Cash",
        value: CASH,
      },
    ];
  }

  const handleCreateForm = transferForm.handleSubmit((value) => {
    transfer.mutate(toPayload(value), {
      onSuccess: () => {
        setDialog(false);
        transferForm.reset();
      },
    });
  });

  if (isLoading) return <>loading...</>;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {transferType === "withdraw"
            ? "Withdraw Transfer"
            : "Deposit Transfer"}
        </DialogTitle>
        <DialogDescription>
          Enter the amount you want to transfer.
        </DialogDescription>
        {transfer.isError && (
          <div role="alert" className="text-sm text-destructive">
            *{transfer.error.message}*
          </div>
        )}
      </DialogHeader>
      <form id="transfer-form" onSubmit={handleCreateForm}>
        <FieldGroup>
          <Controller
            name="fromWalletId"
            control={transferForm.control}
            render={({ field, fieldState }) => (
              <>
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>From Wallet</FieldLabel>
                  <Select
                    items={fromWalletItems}
                    value={field.value}
                    onValueChange={(val) => field.onChange(val) ?? ""}
                    disabled={transferType === "withdraw"}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select a wallet" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        <SelectLabel>From Wallet</SelectLabel>
                        {fromWalletItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError> {fieldState.error.message} </FieldError>
                  )}
                </Field>
              </>
            )}
          />
          <Controller
            name="toWalletId"
            control={transferForm.control}
            render={({ field, fieldState }) => (
              <>
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>To Wallet</FieldLabel>
                  <Select
                    items={toWalletItems}
                    value={field.value}
                    onValueChange={(val) => field.onChange(val) ?? ""}
                    disabled={transferType === "deposit"}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select a wallet" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      <SelectGroup>
                        <SelectLabel>To Wallet</SelectLabel>
                        {toWalletItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError> {fieldState.error.message} </FieldError>
                  )}
                </Field>
              </>
            )}
          />
          <Controller
            name="amount"
            control={transferForm.control}
            render={({ field, fieldState }) => (
              <>
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Amount</FieldLabel>
                  <Input
                    type="text"
                    inputMode="decimal"
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
                    placeholder="Enter amount to transfer"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <FieldError>{fieldState.error?.message}</FieldError>
                  )}
                </Field>
              </>
            )}
          />
        </FieldGroup>
      </form>
      <DialogFooter className="pt-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => setDialog(false)}
          className="cursor-pointer"
        >
          Back
        </Button>
        <Button
          type="submit"
          form="transfer-form"
          disabled={transfer.isPending}
          className="cursor-pointer"
        >
          Transfer
        </Button>
      </DialogFooter>
    </>
  );
};

export default TransferWalletForm;
