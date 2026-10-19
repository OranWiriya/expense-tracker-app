"use client";

import {
  expenseItems,
  IncomeItems,
} from "@/components/layout/AppTopbar/topbar-data";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableFeatures, features } from "@/lib/table-features";
import { cn } from "@/lib/utils";
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  useTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import FilterSelect from "./FilterSelect";
import { useWalletList } from "@/hooks/useWallet";
import { walletsToSelectItems } from "@/lib/select-options";

import { DateRangeFilter, toBangkokDay } from "@/lib/date-range";
import FilterDate from "./FilterDate";
import FilterTags from "./FilterTags";
import { useTagList } from "@/hooks/useTag";
import { Transaction } from "@/schemas/transaction.schema";
import { CATEGORIES, isCategory } from "@/constants/CategoriesIcon";
import { downloadFile, exportPdf, toCsv } from "@/lib/export";
import { useBulkDeleteTransactions } from "@/hooks/useTransaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

interface DataTableProps<TData extends Transaction> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  walletNameById: Map<string, string>;
}

const categoryFilterItems = [
  ...expenseItems,
  ...IncomeItems.filter((item) => item.value !== "etc"),
];

const paginationOptions = [
  { label: "10", value: 10 },
  { label: "20", value: 20 },
  { label: "30", value: 30 },
];

const toExportRows = (
  txs: Transaction[],
  walletNameById: Map<string, string>,
) =>
  txs.map((t) => ({
    date: toBangkokDay(t.date),
    type: t.type,
    amount: t.amount,
    wallet: walletNameById.get(t.walletId) ?? "",
    category: CATEGORIES[isCategory(t.categoryId) ? t.categoryId : "etc"].label,
    tags: t.tags.map((x) => x.label).join("; "),
    description: t.description,
  }));

export function getPageItems(
  currentPage: number,
  totalPage: number,
  siblings = 1, // number of sibling pages to show
): PageItem[] {
  // if total page is less than or equal to max without ellipsis
  const maxWithoutEllipsis = siblings * 2 + 5;
  if (totalPage <= maxWithoutEllipsis) {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  }

  const left = Math.max(currentPage - siblings, 1);
  const right = Math.min(currentPage + siblings, totalPage);

  const showStartEllipsis = left > 2;
  const showEndEllipsis = right < totalPage - 1;

  const range = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, i) => from + i);

  // close to start: 1 2 3 4 5 ... 50
  if (!showStartEllipsis && showEndEllipsis) {
    const count = siblings * 2 + 3;
    return [...range(1, count), "ellipsis-end", totalPage];
  }

  // close to end: 1 ... 46 47 48 49 50
  if (showStartEllipsis && !showEndEllipsis) {
    const count = siblings * 2 + 3;
    return [1, "ellipsis-start", ...range(totalPage - count + 1, totalPage)];
  }

  // middle: 1 ... 5 [6] 7 ... 50
  return [
    1,
    "ellipsis-start",
    ...range(left, right),
    "ellipsis-end",
    totalPage,
  ];
}

function createPaginationButtons({
  totalPage,
  currentPage,
  handlePageClick,
}: {
  totalPage: number;
  currentPage: number;
  handlePageClick: (pageIndex: number) => void;
}) {
  return getPageItems(currentPage, totalPage).map((item) => {
    if (typeof item === "string") {
      return (
        <span key={item} className="px-2 text-muted-foreground select-none">
          …
        </span>
      );
    }

    return (
      <Button
        key={item}
        type="button"
        size="icon"
        variant={currentPage === item ? "default" : "outline"}
        onClick={() => handlePageClick(item - 1)}
        className={cn(
          "cursor-pointer size-8",
          currentPage === item && "font-bold",
        )}
      >
        {item}
      </Button>
    );
  });
}

const TransactionsTable = <TData extends Transaction>({
  columns,
  data,
  walletNameById,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const { data: wallets, isLoading } = useWalletList();
  const { data: tags = [] } = useTagList();
  const { mutate: bulkDelete, isPending } = useBulkDeleteTransactions();

  const table = useTable({
    features,
    data,
    columns,
    getRowId: (row) => row.transactionId,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    defaultColumn: {
      size: 20,
      minSize: 0,
    },
    initialState: {
      columnVisibility: {
        type: false,
      },
    },
  });

  const activeCount = table.state.columnFilters.length;
  const setFilter = (columnId: string, value: unknown) => {
    table.getColumn(columnId)?.setFilterValue(value);
    table.resetRowSelection();
  };

  const totalPage = table.getPageCount();
  const handleSetPage = (page: number) => table.setPageIndex(page);

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selected = selectedRows.map((r) => r.original); // Transaction[]
  const count = selected.length;

  const handleExport = (format: "csv" | "json" | "pdf") => {
    const rows = toExportRows(selected, walletNameById);
    if (format === "csv")
      downloadFile(toCsv(rows), "transactions.csv", "text/csv");
    if (format === "json")
      downloadFile(
        JSON.stringify(rows, null, 2),
        "transactions.json",
        "application/json",
      );
    if (format === "pdf") return exportPdf(rows);
  };

  return (
    <>
      <div id="header-table" className="flex justify-between pb-4">
        <FieldGroup className="flex flex-row gap-2 ">
          <Field className="max-w-sm">
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="search transaction here"
                value={table.state.globalFilter ?? ""}
                onChange={(event) => {
                  console.log(event.target.value);
                  table.setGlobalFilter(String(event.target.value));
                }}
              />
              {table.state.globalFilter && (
                <InputGroupAddon align="inline-end">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => table.setGlobalFilter("")}
                  >
                    <XIcon />
                  </Button>
                </InputGroupAddon>
              )}
            </InputGroup>
          </Field>
          <Field className="flex gap-2  max-w-12">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <FilterIcon />
                  </Button>
                }
              />
              <PopoverContent className="w-80" align="start">
                <PopoverHeader>
                  <PopoverTitle>Filters</PopoverTitle>
                  <PopoverDescription>
                    All Filter transactions
                  </PopoverDescription>
                </PopoverHeader>
                <FieldGroup className="gap-4 w-full">
                  <Field>
                    <Button
                      variant={activeCount > 0 ? "default" : "outline"}
                      onClick={() => table.resetColumnFilters()}
                    >
                      Clear filters {activeCount > 0 && `(${activeCount})`}
                    </Button>
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="w-1/2">Type</FieldLabel>
                    <FilterSelect
                      label="Type"
                      items={[
                        {
                          label: "Expense",
                          value: "EXPENSE",
                        },
                        {
                          label: "Income",
                          value: "INCOME",
                        },
                      ]}
                      value={
                        table.getColumn("type")?.getFilterValue() as
                          string | undefined
                      }
                      onChange={(v) => setFilter("type", v)}
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="w-1/2">Catagory</FieldLabel>
                    <FilterSelect
                      label="Category"
                      items={categoryFilterItems} // expense + income remove etc that duplicated
                      value={
                        table.getColumn("category")?.getFilterValue() as
                          string | undefined
                      }
                      onChange={(v) => setFilter("category", v)}
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="w-1/2">Wallet</FieldLabel>
                    <div className="w-full">
                      <FilterSelect
                        label="Wallet"
                        items={[
                          ...(isLoading
                            ? []
                            : walletsToSelectItems(wallets ?? [])),
                        ]}
                        value={
                          table.getColumn("wallet")?.getFilterValue() as
                            string | undefined
                        }
                        onChange={(v) => setFilter("wallet", v)}
                      />
                    </div>
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="w-1/2">Date</FieldLabel>
                    <FilterDate
                      value={
                        table.getColumn("date")?.getFilterValue() as
                          DateRangeFilter | undefined
                      }
                      onChange={(v) => setFilter("date", v)}
                    />
                  </Field>
                  <Field orientation="horizontal">
                    <FieldLabel className="w-1/2">Tags</FieldLabel>
                    <FilterTags
                      tags={tags}
                      value={
                        table.getColumn("tags")?.getFilterValue() as
                          string[] | undefined
                      }
                      onChange={(v) => setFilter("tags", v)}
                    />
                  </Field>
                </FieldGroup>
              </PopoverContent>
            </Popover>
          </Field>
          <Field className="flex gap-2 max-w-12">
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <DownloadIcon />
                  </Button>
                }
              />
              <PopoverContent className="w-50" align="start">
                <PopoverHeader>
                  <PopoverTitle>Export Transactions</PopoverTitle>
                  <PopoverDescription>
                    Select the format you want to export
                  </PopoverDescription>
                </PopoverHeader>
                <FieldGroup className="flex flex-row gap-2 w-full">
                  <Field>
                    <Button
                      variant={"outline"}
                      className="cursor-pointer"
                      onClick={() => handleExport("csv")}
                    >
                      CSV
                    </Button>
                  </Field>
                  <Field>
                    <Button
                      variant={"outline"}
                      className="cursor-pointer"
                      onClick={() => handleExport("json")}
                    >
                      JSON
                    </Button>
                  </Field>
                  <Field>
                    <Button
                      variant={"outline"}
                      className="cursor-pointer"
                      onClick={() => handleExport("pdf")}
                    >
                      PDF
                    </Button>
                  </Field>
                </FieldGroup>
              </PopoverContent>
            </Popover>
          </Field>
          <Field className="flex gap-2 w-12">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setConfirmOpen(true)}
              disabled={count === 0}
              className="cursor-pointer"
            >
              <TrashIcon />
            </Button>
          </Field>
        </FieldGroup>
        <div className="hidden sm:flex flex-row-reverse items-center text-sm text-muted-foreground sm:w-48">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
      <div id="content-table" className="overflow-hidden border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.getSize()}%`,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}%` }}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div id="footer-table">
        <div className="flex flex-wrap flex-col justify-between items-center gap-2 space-x-6 mt-2 sm:flex-row lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              items={paginationOptions}
              value={`${table.state.pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8!">
                <SelectValue placeholder={table.state.pagination.pageSize} />
              </SelectTrigger>
              <SelectContent className="min-w-16 w-16">
                <SelectGroup>
                  {paginationOptions.map((pageSize) => (
                    <SelectItem
                      key={pageSize.label}
                      value={`${pageSize.value}`}
                    >
                      {pageSize.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            {createPaginationButtons({
              totalPage,
              currentPage: table.state.pagination.pageIndex + 1,
              handlePageClick: handleSetPage,
            })}
          </div>
          <div className="flex items-center gap-2 w-full justify-between sm:w-fit sm:justify-baseline">
            <div className="flex gap-2 ">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="gap-4">
          <DialogHeader>
            <DialogTitle className="text-lg">
              Delete: {count} transactions?
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-1 text-secondary-foreground">
              Do you really want to delete all transactions?
              <span className="text-xs text-muted-foreground">
                The transaction history will also be deleted.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={() =>
                bulkDelete(
                  selected.map((t) => t.transactionId),
                  {
                    onSuccess: () => {
                      table.resetRowSelection();
                      setConfirmOpen(false);
                    },
                  },
                )
              }
              className="cursor-pointer"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionsTable;
