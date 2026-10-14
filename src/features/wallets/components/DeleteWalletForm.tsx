import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteWallet } from "@/hooks/useWallet";

interface DeleteWalletFormProps {
  setDialog: (open: boolean) => void;
  walletId: string;
  title: string;
}

const DeleteWalletForm = (props: DeleteWalletFormProps) => {
  const { setDialog, walletId, title = "This Wallet" } = props;
  const deleteWallet = useDeleteWallet();

  const handleDeleteWallet = () => {
    deleteWallet.mutate(
      { walletId, withTransactions: true, title },
      {
        onSuccess: () => {
          setDialog(false);
        },
      },
    );
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg">
          Delete Wallet:{" "}
          <span className="font-bold text-destructive">{title}</span>
        </DialogTitle>
        <DialogDescription className="flex flex-col gap-1 text-secondary-foreground">
          Do you really want to delete this wallet?
          <span className="text-xs text-muted-foreground">
            The transaction history will also be deleted.
          </span>
        </DialogDescription>
      </DialogHeader>
      {deleteWallet.isError && (
        <div className="text-lg text-destructive">
          {deleteWallet.error.message}
        </div>
      )}
      <DialogFooter>
        <Button
          variant={"outline"}
          onClick={() => setDialog(false)}
          disabled={deleteWallet.isPending}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          variant={"destructive"}
          onClick={handleDeleteWallet}
          disabled={deleteWallet.isPending}
          className="cursor-pointer"
        >
          Delete
        </Button>
      </DialogFooter>
    </>
  );
};

export default DeleteWalletForm;
