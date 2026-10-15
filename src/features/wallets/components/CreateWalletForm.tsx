import {
  Controller,
  ControllerRenderProps,
  Resolver,
  useForm,
} from "react-hook-form";
import { walletInputSchema, WalletInputValues } from "@/schemas/wallet.schema";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateWallet } from "@/hooks/useWallet";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateWalletFormProp {
  setDialog: (open: boolean) => void;
}

const WALLET_NAME_PATTERN = /^[a-zA-Z0-9_]+$/;

const CreateWalletForm = (props: CreateWalletFormProp) => {
  const { setDialog } = props;
  const { mutate, isPending } = useCreateWallet();
  const { control, handleSubmit, reset } = useForm<WalletInputValues>({
    resolver: zodResolver(walletInputSchema) as Resolver<WalletInputValues>,
    defaultValues: { name: "" },
  });

  const handleChange = ({
    e,
    field,
  }: {
    e: React.ChangeEvent<HTMLInputElement>;
    field: ControllerRenderProps<WalletInputValues>;
  }) => {
    const value = e.target.value;

    if (value.length === 0 || WALLET_NAME_PATTERN.test(value)) {
      field.onChange(value);
    }
  };

  const handleCreateForm = handleSubmit((value) => {
    mutate(value, {
      onSuccess: () => {
        setDialog(false);
        reset();
      },
    });
  });
  return (
    <>
      <DialogHeader>
        <DialogTitle>Create Your Wallet</DialogTitle>
        <DialogDescription className="flex flex-col gap-1">
          Enter a name for your wallet here
          <span className="text-xs text-destructive">
            *it&lsquo;s only accepted letters,numbers and underscore only
          </span>
        </DialogDescription>
      </DialogHeader>
      <form id="create-wallet-form" onSubmit={handleCreateForm}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid} className="gap-1.5">
                <FieldLabel htmlFor="name">name</FieldLabel>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter the name of wallet"
                  value={field.value}
                  onChange={(e) => handleChange({ e, field })}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            );
          }}
        />
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
          form="create-wallet-form"
          disabled={isPending}
          className="cursor-pointer"
        >
          Create
        </Button>
      </DialogFooter>
    </>
  );
};

export default CreateWalletForm;
