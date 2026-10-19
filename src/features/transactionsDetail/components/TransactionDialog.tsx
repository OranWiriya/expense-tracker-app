import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumberByCurrency } from "@/lib/format-number";

interface TransactionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  amount: number;
  isDeleting: boolean;
  handleDeleteTransaction: () => void;
}

const TransactionDialog = (props: TransactionDialogProps) => {
  const { open, setOpen, amount, isDeleting, handleDeleteTransaction } = props;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-4">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Delete Transaction:{" "}
            <span className="font-bold text-destructive">
              {formatNumberByCurrency(amount)}
            </span>
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-1 text-secondary-foreground">
            Do you really want to delete this transaction?
            <span className="text-xs text-muted-foreground">
              The transaction history will also be deleted.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            }
          />
          <Button
            type="button"
            variant="destructive"
            className="cursor-pointer"
            disabled={isDeleting}
            onClick={handleDeleteTransaction}
          >
            {"Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDialog;
