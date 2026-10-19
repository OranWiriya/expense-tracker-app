"use client";

import { Button } from "@/components/ui/button";
import { WalletCard, WalletDialog } from "@/features/wallets/components";
import { useWalletList } from "@/hooks/useWallet";

function WalletPage() {
  const { data: wallets, isLoading, isSuccess } = useWalletList();

  const totalBalance = wallets?.reduce(
    (acc, wallet) => acc + wallet.balance,
    0,
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end">
        <WalletDialog type="create">
          <Button className="cursor-pointer">Add wallet</Button>
        </WalletDialog>
      </div>
      {isLoading ? (
        <>loading...</>
      ) : (
        <>
          {isSuccess && (
            <>
              <WalletCard
                title="Total Balance"
                totalBalance={totalBalance}
                type="total"
              />
              {wallets?.map((wallet) => (
                <WalletCard
                  key={wallet.id}
                  title={wallet.name}
                  totalBalance={wallet.balance}
                  walletId={wallet.id}
                />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default WalletPage;
