import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import CreateWalletForm from "./CreateWalletForm";
import DeleteWalletForm from "./DeleteWalletForm";
import TransferWalletForm from "./TransferWalletForm";

export const WalletDialogType = {
  CREATE: "create",
  DELETE: "delete",
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
} as const;

export type WalletDialogType =
  (typeof WalletDialogType)[keyof typeof WalletDialogType];

interface WalletDialogProps {
  type: WalletDialogType;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  walletId?: string;
  title?: string;
}

interface ActionContentProps {
  type: WalletDialogType;
  setDialog: (open: boolean) => void;
  walletId?: string;
  title?: string;
}

const ActionContent = (props: ActionContentProps) => {
  const { type, setDialog, walletId, title } = props;
  switch (type) {
    case "create":
      return <CreateWalletForm setDialog={setDialog} />;

    case "delete":
      if (walletId === undefined) {
        return null;
      }
      return (
        <DeleteWalletForm
          setDialog={setDialog}
          walletId={walletId}
          title={title ?? ""}
        />
      );
    case "deposit":
      if (walletId === undefined) {
        return null;
      }
      return (
        <TransferWalletForm
          transferType="deposit"
          walletId={walletId}
          setDialog={setDialog}
        />
      );
    case "withdraw":
      if (walletId === undefined) {
        return null;
      }
      return (
        <TransferWalletForm
          transferType="withdraw"
          walletId={walletId}
          setDialog={setDialog}
        />
      );
    default:
      return null;
  }
};

const WalletDialog = (props: WalletDialogProps) => {
  const { type, open, onOpenChange, walletId, title, children } = props;
  const [internalOpen, setInternalOpen] = useState<boolean>(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {children && <DialogTrigger render={children as React.ReactElement} />}
      <DialogContent className="gap-4">
        <ActionContent
          type={type}
          setDialog={handleOpenChange}
          walletId={walletId}
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WalletDialog;
