"use client";

import { useEffect, useState } from "react";
import { Control, useForm, UseFormSetValue } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  CATEGORIES,
  CategoryIcon,
  isCategory,
} from "@/constants/CategoriesIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatNumberByCurrency } from "@/lib/format-number";
import RenderField from "@/constants/RenderField";
import {
  TransactionFormInput,
  TransactionFormOutput,
  transactionFormSchema,
  transactionInputSchema,
} from "@/schemas/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";
import {
  useDeleteTransaction,
  useTransactionDetail,
  useUpdateTransaction,
} from "@/hooks/useTransaction";
import { toFormValues } from "@/lib/mapper";
import { useWalletList } from "@/hooks/useWallet";
import { SelectItemType, walletsToSelectItems } from "@/lib/select-options";
import TransactionDialog from "./TransactionDialog";
import { formatDate } from "@/lib/date-range";

interface TransactionDetailProps {
  transactionId: string;
}

const emptyValues: TransactionFormInput = {
  walletId: "",
  categoryId: null,
  type: "EXPENSE",
  amount: 0,
  tagIds: [],
  newTagNames: [],
  date: "",
  description: "",
};

const DetailRow = ({
  label,
  value,
  editable = false,
  type,
  name,
  control,
  itemDatas,
  onValueChange,
  onNewTagNamesChange,
}: {
  label: string;
  value: React.ReactNode;
  editable: boolean;
  type: string;
  name: keyof TransactionFormInput;
  control: Control<TransactionFormInput, unknown, TransactionFormOutput>;
  itemDatas?: SelectItemType[];
  onValueChange?: (val: string | null) => void;
  onNewTagNamesChange?: UseFormSetValue<TransactionFormInput>;
}) => {
  return (
    <div className="grid grid-cols-6">
      <div className="col-span-1 font-bold self-center">{label}:</div>
      {editable ? (
        <div className="col-span-3 *:w-full">
          <RenderField
            type={type}
            name={name}
            itemDatas={itemDatas}
            control={control}
            onValueChange={onValueChange}
            onNewTagNamesChange={onNewTagNamesChange}
          />
        </div>
      ) : (
        <div className="col-span-3">{value}</div>
      )}
    </div>
  );
};

const TransactionDetail = (props: TransactionDetailProps) => {
  const { transactionId } = props;
  const [edit, setEdit] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { data: transactionDetail, isLoading } =
    useTransactionDetail(transactionId);
  const { data: wallets } = useWalletList();
  const { mutate: updateTransaction, isPending } = useUpdateTransaction();
  const { mutate: deleteTransaction, isPending: isDeleting } =
    useDeleteTransaction();
  const router = useRouter();

  const transactionForm = useForm<
    TransactionFormInput,
    unknown,
    TransactionFormOutput
  >({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: emptyValues,
    values: transactionDetail ? toFormValues(transactionDetail) : undefined,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!transactionDetail) router.replace("/transactions");
  }, [isLoading, router, transactionDetail]);

  const { isDirty } = transactionForm.formState;
  const catagoryData = isCategory(transactionDetail?.categoryId)
    ? transactionDetail.categoryId
    : "etc";

  const walletItems = walletsToSelectItems(wallets || []);
  const displayTags = transactionDetail?.tags || [];

  const handleCancel = () => {
    transactionForm.reset(
      transactionDetail ? toFormValues(transactionDetail) : emptyValues,
    );
    setEdit(false);
  };
  const onSubmitTransaction = transactionForm.handleSubmit(
    (values) => {
      const payload = transactionInputSchema.parse(values);
      console.log(isDirty, payload);
      if (isDirty) {
        updateTransaction(
          { transactionId, values: payload },
          {
            onSuccess: () => {
              setEdit(false);
            },
          },
        );
      }
    },
    (errors) => {
      toast.add({
        title: "Error",
        description: `${errors.root?.message}` || "Something went wrong",
        type: "error",
      });
    },
  );

  const handleDeleteTransaction = () => {
    deleteTransaction(transactionId, {
      onSuccess: () => {
        router.replace("/transactions");
      },
    });
  };

  if (!transactionDetail) {
    return null;
  }

  return (
    <>
      <Card className="m-3">
        <CardHeader>
          <CardTitle className="flex flex-row gap-2">
            <h1>TransactionDetail:</h1>
            <span className="text-primary-foreground font-bold">
              {transactionId}
            </span>
          </CardTitle>
        </CardHeader>
        <Separator />
        <form id="transaction-detail-form" onSubmit={onSubmitTransaction}>
          <CardContent className="gap-5">
            <DetailRow
              label="Type"
              type="select"
              name="type"
              control={transactionForm.control}
              value={transactionDetail.type}
              onValueChange={() =>
                transactionForm.setValue("categoryId", null, {
                  shouldDirty: true,
                })
              }

              editable={edit}
            />
            <DetailRow
              label="Amount"
              type="number"
              name="amount"
              control={transactionForm.control}
              value={formatNumberByCurrency(transactionDetail.amount)}
              editable={edit}
            />
            <DetailRow
              label="Wallet"
              type="select"
              name="walletId"
              control={transactionForm.control}
              value={
                walletItems.find(
                  (item) => item.value === transactionDetail.walletId,
                )?.label
              }
              itemDatas={walletItems}
              editable={edit}
            />
            <DetailRow
              label="Date"
              name="date"
              type="date"
              control={transactionForm.control}
              value={formatDate(transactionDetail.date)}
              editable={edit}
            />
            <DetailRow
              label="Category"
              name="categoryId"
              type="select"
              control={transactionForm.control}
              value={
                transactionDetail.categoryId && (
                  <div className="flex items-center gap-2">
                    <CategoryIcon category={catagoryData} className="size-5" />
                    {CATEGORIES[catagoryData].label}
                  </div>
                )
              }
              editable={edit}
            />
            <DetailRow
              label="Tags"
              name="tagIds"
              type="multi-select"
              control={transactionForm.control}
              value={
                <div className="flex gap-1 max-w-40 scroll-smooth">
                  {displayTags.length > 0 ? (
                    displayTags.map((tag) => (
                      <Badge
                        key={tag.tagId}
                        className="bg-zinc-200 text-accent-foreground"
                      >
                        {tag.label}
                      </Badge>
                    ))
                  ) : (
                    <div>-</div>
                  )}
                </div>
              }
              onNewTagNamesChange={transactionForm.setValue}
              editable={edit}
            />
            <DetailRow
              label="Note"
              name="description"
              type="text"
              control={transactionForm.control}
              value={
                transactionDetail.description.length > 0
                  ? transactionDetail.description
                  : "-"
              }
              editable={edit}
            />
          </CardContent>
        </form>
        <Separator />
        <CardFooter className="justify-between">
          <Button
            variant="secondary"
            type="button"
            className="cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            Back
          </Button>
          {edit ? (
            <div className="flex gap-2">
              <Button
                variant={"secondary"}
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant={"default"}
                type="submit"
                form="transaction-detail-form"
                disabled={!isDirty || isPending}
              >
                Save
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="default"
                type="button"
                onClick={() => setEdit((prev) => !prev)}
                className="cursor-pointer"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="cursor-pointer"
              >
                Delete
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      {
        <TransactionDialog
          open={open}
          setOpen={setOpen}
          amount={transactionDetail.amount}
          isDeleting={isDeleting}
          handleDeleteTransaction={handleDeleteTransaction}
        />
      }
    </>
  );
};

export default TransactionDetail;
