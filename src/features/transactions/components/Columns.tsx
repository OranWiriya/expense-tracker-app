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
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRangeFilter, toBangkokDay } from "@/lib/date-range";

// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, Transaction>();

export const getColumns = (walletNameById: Map<string, string>) => {
  return columnHelper.columns([
    columnHelper.display({
      size: 5,
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
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
      header: ({ column }) => {
        return (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Date
                  <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">Sort by date</TooltipContent>
          </Tooltip>
        );
      },
      size: 12,
      filterFn: (row, _columnId, filterValue: DateRangeFilter) => {
        if (!filterValue?.from && !filterValue?.to) return true;
        const day = toBangkokDay(row.original.date);
        if (filterValue.from && day < filterValue.from) return false;
        if (filterValue.to && day > filterValue.to) return false;
        return true;
      },
      cell: ({ row }) => {
        const rawDate = row.getValue("date") as string;
        const date = new Date(rawDate);
        return <div>{date.toLocaleDateString("th-TH")}</div>;
      },
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => {
        return (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Amount
                  <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">Sort by amount</TooltipContent>
          </Tooltip>
        );
      },
      size: 15,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = formatNumberByCurrency(amount);

        const colorFormatted =
          row.original.type === "EXPENSE" ? "text-pink-600" : "text-lime-600";

        return (
          <div className={colorFormatted + " font-medium"}>{formatted}</div>
        );
      },
    }),
    columnHelper.accessor((row) => walletNameById.get(row.walletId) ?? "", {
      id: "wallet",
      header: ({ column }) => {
        return (
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                  }
                >
                  Wallet
                  <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                </Button>
              }
            />
            <TooltipContent side="top">Sort by Wallet</TooltipContent>
          </Tooltip>
        );
      },
      size: 15,
      filterFn: (row, _columnId, filterValue: string) =>
        !filterValue || row.original.walletId === filterValue,
      cell: ({ getValue }) => {
        return <div>{getValue() ?? ""}</div>;
      },
    }),
    columnHelper.accessor(
      (row) =>
        CATEGORIES[isCategory(row.categoryId) ? row.categoryId : "etc"].label,
      {
        id: "category",
        header: ({ column }) => {
          return (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    onClick={() =>
                      column.toggleSorting(column.getIsSorted() === "asc")
                    }
                  >
                    Category
                    <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                }
              />
              <TooltipContent side="top">Sort by category</TooltipContent>
            </Tooltip>
          );
        },
        size: 10,
        maxSize: 20,
        filterFn: (row, _columnId, filterValue: string) =>
          !filterValue || row.original.categoryId === filterValue,
        cell: ({ row }) => {
          const raw = row.original.categoryId;
          const category: Category = isCategory(raw) ? raw : "etc";

          return (
            <div className="flex items-center gap-2">
              <span>
                {<CategoryIcon category={category} className="size-4" />}
              </span>
              <span>{CATEGORIES[category].label.toLocaleLowerCase()}</span>
            </div>
          );
        },
      },
    ),
    columnHelper.accessor((row) => row.tags.map((t) => t.label).join(" "), {
      id: "tags",
      header: "Tags",
      size: 10,
      filterFn: (row, _columnId, filterValue: string[]) => {
        if (!filterValue || filterValue.length === 0) return true;
        const rowTagIds = row.original.tags.map((t) => t.tagId);
        // ANY: มีอย่างน้อยหนึ่งตัว
        return filterValue.some((id) => rowTagIds.includes(id));
        // ALL: เปลี่ยนเป็น filterValue.every((id) => rowTagIds.includes(id))
      },
      cell: ({ row }) => {
        return <TagCell tags={row.original.tags} />;
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

        return (
          <ActionCell transactionId={id} amount={row.getValue("amount")} />
        );
      },
    }),
    columnHelper.accessor("type", {
      id: "type",
      header: "Type",
      size: 0,
      meta: { noPadding: true },

      cell: () => {},
      filterFn: (row, _columnId, filterValue: string) =>
        !filterValue || row.original.type === filterValue,
    }),
  ]);
};
