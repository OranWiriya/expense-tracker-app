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
import { useDeleteTransaction } from "@/hooks/useTransaction";

import { FilePenLineIcon, MoreHorizontal, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ActionCellProps {
  transactionId: string;
}

const ActionCell = (props: ActionCellProps) => {
  const { transactionId } = props;
  const router = useRouter();
  const { mutate, isPending } = useDeleteTransaction();

  const handleDelete = () => {
    console.log(transactionId);
    mutate(transactionId);
    router.refresh();
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
            <DropdownMenuItem>
              <Link href={`/transactions/${transactionId}`}>
                <FilePenLineIcon />
                View transaction details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              className="cursor-pointer"
              disabled={isPending}
            >
              <Trash2Icon />
              Delete transaction
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionCell;
