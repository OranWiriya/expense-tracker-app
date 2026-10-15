"use client";

import { useEffect, useState } from "react";
import { Control, Resolver, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useTagStore, useTransactionStore } from "@/store";
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
import { filterTagsById } from "@/lib/tag-utils";
import RenderField from "@/constants/RenderField";
import {
  TransactionFormValues,
  transactionInputSchema,
} from "@/schemas/transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/toast";

interface TransactionDetailProps {
  transactionId: string;
}

const defaultValues: TransactionFormValues = {
  walletId: "",
  categoryId: "",
  type: "expense",
  amount: 0,
  tagIds: [],
  date: "",
  description: "",
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-UK", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));

const DetailRow = ({
  label,
  value,
  editable = false,
  type,
  name,
  control,
  onValueChange,
}: {
  label: string;
  value: React.ReactNode;
  editable: boolean;
  type: string;
  name: keyof TransactionFormValues;
  control: Control<TransactionFormValues>;
  onValueChange?: (val: string) => void;
}) => {
  return (
    <div className="grid grid-cols-6">
      <div className="col-span-1 font-bold self-center">{label}:</div>
      {editable ? (
        <div className="col-span-3 *:w-full">
          <RenderField
            type={type}
            name={name}
            control={control}
            onValueChange={onValueChange}
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
  const [edit, setEdit] = useState(false);
  const updateTransaction = useTransactionStore((s) => s.updateTransaction);
  const transactionDetail = useTransactionStore((s) =>
    s.transactions.find((tx) => tx.transactionId === transactionId),
  );
  const tags = useTagStore((state) => state.tags);
  const router = useRouter();

  const transactionForm = useForm<TransactionFormValues>({
    resolver: zodResolver(
      transactionInputSchema,
    ) as Resolver<TransactionFormValues>,
    defaultValues,
    values: transactionDetail,
  });

  useEffect(() => {
    if (!transactionDetail) router.replace("/transactions");
  }, [router, transactionDetail]);

  const { isDirty } = transactionForm.formState;
  const catagoryData = isCategory(transactionDetail?.categoryId)
    ? transactionDetail.categoryId
    : "etc";

  const displayTags = filterTagsById(tags, transactionDetail?.tagIds ?? []);

  const handleCancel = () => {
    transactionForm.reset(transactionDetail ?? defaultValues);
    setEdit(false);
  };

  const onSubmitTransaction = transactionForm.handleSubmit(
    (values) => {
      if (isDirty) {
        updateTransaction(transactionId, values);
        toast.add({ title: "Saved", type: "success" });
      }
      setEdit(false);
    },
    (errors) => {
      toast.add({
        title: "Error",
        description: `${errors.root?.message}` || "Something went wrong",
        type: "error",
      });
    },
  );

  if (!transactionDetail) {
    return null;
  }

  return (
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
              transactionForm.setValue("categoryId", "", {
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
            value={transactionDetail.walletId}
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
            <Button variant={"secondary"} type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant={"default"}
              type="submit"
              form="transaction-detail-form"
              disabled={!isDirty}
            >
              Save
            </Button>
          </div>
        ) : (
          <Button
            variant="default"
            type="button"
            onClick={() => setEdit((prev) => !prev)}
            className="cursor-pointer"
          >
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TransactionDetail;
