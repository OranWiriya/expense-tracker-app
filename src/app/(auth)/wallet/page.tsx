import { WalletCard } from "@/features/wallets/components";

function WalletPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <WalletCard title="Total Balance" totalBalance={1000} type="total" />
      <WalletCard title="Wallet 1" totalBalance={1000} />
      <WalletCard title="Wallet 2" totalBalance={-500} />
      <WalletCard title="Wallet 3" totalBalance={-2500} />
    </div>
  );
}

export default WalletPage;
