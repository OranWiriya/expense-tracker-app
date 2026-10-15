import { useWalletList } from "@/hooks/useWallet";

const WalletCell = ({ walletId }: { walletId: string }) => {
  const { data: wallet } = useWalletList();
  const walletName = wallet?.find((w) => w.id === walletId)?.name;
  return <>{walletName}</>;
};

export default WalletCell;
