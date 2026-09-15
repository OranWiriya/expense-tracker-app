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
import Link from "next/link";

interface WalletCardProps {
  type?: "total" | "wallet";
  title?: string;
  subTitle?: string;
  totalBalance?: number;
  walletId?: string;
}

const MOCKWALLETID = "1";

const WalletCard = (props: WalletCardProps) => {
  const {
    title = "Wallet Name",
    subTitle = "Total Balance",
    totalBalance = 1000,
    type = "wallet",
    walletId,
  } = props;
  return (
    <Card className=" bg-primary/10 p-0">
      <CardHeader className="bg-primary min-h-12 flex justify-between items-center ">
        <CardTitle className="text-lg">{title}</CardTitle>
        {type === "wallet" ? (
          <CardAction className="self-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon">
                    {<Menu />}
                  </Button>
                }
              />
              <DropdownMenuContent className="w-32 **:cursor-pointer">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href={"/Deposit"}>Deposit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/withdraw"}>Withdraw</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive">
                    <Link
                      href={`/Delete?walletId=${walletId ? walletId : MOCKWALLETID}`}
                    >
                      Delete Wallet
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="min-h-12 justify-center text-lg">
        <div>
          <span>{subTitle}</span>
          <span> : </span>
          <span
            className={`${totalBalance < 0 ? "text-red-500" : "text-green-500"} font-bold`}
          >
            {totalBalance} THB
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
