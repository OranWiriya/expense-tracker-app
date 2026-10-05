"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type DataTableFeatures } from "@/lib/table-features";
import { Transaction } from "@/schemas/transaction.schema";
import { createColumnHelper } from "@tanstack/react-table";
import {
  AsteriskIcon,
  BeefIcon,
  DiscAlbumIcon,
  GiftIcon,
  ShirtIcon,
  WalletIcon,
} from "lucide-react";
import TagCell from "./TagCell";
import ActionCell from "./ActionCell";

type CatagoriesIcon = {
  [key: string]: React.ReactElement;
};

const catagoriesIcon: CatagoriesIcon = {
  food: <BeefIcon className="text-orange-500" />,
  entertainment: <DiscAlbumIcon className="text-pink-500" />,
  clothing: <ShirtIcon className="text-blue-500" />,
  salary: <WalletIcon className="text-lime-500" />,
  gift: <GiftIcon className="text-lime-500" />,
  etc: <AsteriskIcon className="text-gray-500" />,
};

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Transaction>();

export const columns = columnHelper.columns([
  // columnHelper.display({
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       indeterminate={
  //         table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  // }),
  // columnHelper.accessor("email", {
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Email
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // }),
  columnHelper.display({
    id: "select",
    size: 5,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  }),
  columnHelper.accessor("date", {
    header: "Date",
    size: 12,
    cell: ({ row }) => {
      const rawDate = row.getValue("date") as string;
      const date = new Date(rawDate);
      return <div>{date.toLocaleDateString("th-TH")}</div>;
    },
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    size: 15,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatterCurrency = new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 2,
      });
      const formatted = formatterCurrency
        .formatToParts(amount)
        .map((part) => {
          return part.type === "currency" ? `${part.value} ` : part.value;
        })
        .join("");

      const colorFormatted =
        row.original.type === "expense" ? "text-pink-600" : "text-lime-600";

      return <div className={colorFormatted + " font-medium"}>{formatted}</div>;
    },
  }),
  columnHelper.accessor("walletId", {
    header: "Wallet",
    size: 15,
    cell: ({ row }) => {
      return <div>{row.getValue("walletId")}</div>;
    },
  }),
  columnHelper.accessor("categoryId", {
    header: "Category",
    size: 10,
    maxSize: 20,
    cell: ({ row }) => {
      const iconKeySelection = row.getValue("categoryId")
        ? String(row.getValue("categoryId"))
        : "etc";
      const iconCatagorySelected =
        catagoriesIcon[iconKeySelection as keyof CatagoriesIcon];

      return (
        <div className="flex items-end gap-2">
          <span>{iconCatagorySelected}</span>
          <span>{row.getValue("categoryId")}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("tagIds", {
    header: "Tags",
    size: 10,
    cell: ({ row }) => {
      return <TagCell tagId={String(row.getValue("tagIds"))} />;
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    size: 30,
    cell: ({ row }) => {
      return (
        <div className="gap-1 max-w-125 truncate scroll-fade-r">
          {row.getValue("description")}
        </div>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    size: 3,
    cell: ({ row }) => {
      const id = row.original.transactionId;

      console.log(id);

      return <ActionCell transactionId={id} />;
    },
  }),
]);
