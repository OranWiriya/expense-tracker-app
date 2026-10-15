import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import WalletDialog, { WalletDialogType } from "./WalletDialog";
import { useState } from "react";
import { formatNumberByCurrency } from "@/lib/format-number";

interface WalletCardProps {
  type?: "total" | "wallet";
  title?: string;
  subTitle?: string;
  totalBalance?: number;
  walletId?: string;
}

const totalClassName = "min-h-12 flex justify-between items-center";

const balanceClassName = (totalBalance: number) => {
  let classNameCustom = "";
  if (totalBalance === 0) classNameCustom = "text-mute-foreground";
  else
    classNameCustom = `${totalBalance < 0 && totalBalance !== 0 ? "text-red-500" : "text-green-500"}`;
  return classNameCustom + " font-semibold";
};

const WalletCard = (props: WalletCardProps) => {
  const {
    title = "Wallet Name",
    subTitle = "Total Balance",
    totalBalance = 1000,
    type = "wallet",
    walletId,
  } = props;
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<WalletDialogType>(
    WalletDialogType.DEPOSIT,
  );

  const handleOpenDialog = (type: WalletDialogType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <Card
      className={type === "total" ? "bg-primary/10 p-0" : "bg-secondary/10 p-0"}
    >
      <CardHeader
        className={
          type === "total"
            ? "bg-primary " + totalClassName
            : "bg-secondary " + totalClassName
        }
      >
        <CardTitle className="text-lg">{title}</CardTitle>
        {type === "wallet" ? (
          <CardAction className="self-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={"cursor-pointer"}
                  >
                    {<Menu />}
                  </Button>
                }
              />
              <DropdownMenuContent className="w-32 **:cursor-pointer">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="default"
                    onClick={() => handleOpenDialog(WalletDialogType.DEPOSIT)}
                  >
                    Deposit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="default"
                    onClick={() => handleOpenDialog(WalletDialogType.WITHDRAW)}
                  >
                    Withdraw
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleOpenDialog(WalletDialogType.DELETE)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="min-h-10 text-lg ">
        <div>
          <span>{subTitle}</span>
          <span> : </span>
          <span className={balanceClassName(totalBalance)}>
            {formatNumberByCurrency(totalBalance)} THB
          </span>
        </div>
      </CardContent>
      {type === "wallet" && (
        <WalletDialog
          type={dialogType}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={title}
          walletId={walletId}
        />
      )}
    </Card>
  );
};

export default WalletCard;
