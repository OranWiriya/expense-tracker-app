"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type DataTableFeatures } from "@/lib/table-features";
import { Transaction } from "@/schemas/transaction.schema";
import { createColumnHelper } from "@tanstack/react-table";
import TagCell from "./TagCell";
import ActionCell from "./ActionCell";
import { formatNumberByCurrency } from "@/lib/format-number";
import {
  CATEGORIES,
  CategoryIcon,
  isCategory,
} from "@/constants/CategoriesIcon";
import { Category } from "@/generated/prisma/enums";
import WalletCell from "./WalletCell";

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
      const formatted = formatNumberByCurrency(amount);

      const colorFormatted =
        row.original.type === "EXPENSE" ? "text-pink-600" : "text-lime-600";

      return <div className={colorFormatted + " font-medium"}>{formatted}</div>;
    },
  }),
  columnHelper.accessor("walletId", {
    header: "Wallet",
    size: 15,
    cell: ({ row }) => {
      return (
        <div>
          <WalletCell walletId={row.getValue("walletId")} />
        </div>
      );
    },
  }),
  columnHelper.accessor("categoryId", {
    header: "Category",
    size: 10,
    maxSize: 20,
    cell: ({ row }) => {
      const raw = row.getValue("categoryId");
      const category: Category = isCategory(raw) ? raw : "etc";

      console.log(raw, category);
      return (
        <div className="flex items-center gap-2">
          <span>{<CategoryIcon category={category} className="size-4" />}</span>
          <span>{CATEGORIES[category].label.toLocaleLowerCase()}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    size: 10,
    cell: ({ row }) => {
      console.log(row.getValue("tags"));
      return <TagCell tags={row.getValue("tags")} />;
    },
  }),
  columnHelper.accessor("description", {
    header: "Description",
    size: 30,
    cell: ({ row }) => {
      return (
        <div className="gap-1 max-w-125 truncate scroll-fade-r scroll-smooth">
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
