import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionDialog } from "@/features/transactionsDetail/components";
import { useDeleteTransaction } from "@/hooks/useTransaction";

import { FilePenLineIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ActionCellProps {
  transactionId: string;
  amount: number;
}

const ActionCell = (props: ActionCellProps) => {
  const { transactionId, amount } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const { mutate, isPending } = useDeleteTransaction();

  const handleDelete = () => {
    mutate(transactionId, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  };
  return (
    <div className="text-center">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </DropdownMenuTrigger>
        <DropdownMenuContent className={"w-48"}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              render={
                <Link href={`/transactions/${transactionId}`}>
                  <FilePenLineIcon />
                  View transaction details
                </Link>
              }
            />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setDialogOpen(true)}
              className="cursor-pointer"
              disabled={isPending}
            >
              <Trash2Icon />
              Delete transaction
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TransactionDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        amount={amount}
        isDeleting={isPending}
        handleDeleteTransaction={handleDelete}
      />
    </div>
  );
};

export default ActionCell;
