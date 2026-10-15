import { WalletValues } from "@/schemas/wallet.schema";

export type SelectItemType = {
  label: React.ReactNode;
  value: string;
};

export const walletsToSelectItems = (
  wallets: WalletValues[],
): SelectItemType[] =>
  wallets.map((wallet) => ({
    label: wallet.name,
    value: wallet.id,
  }));
