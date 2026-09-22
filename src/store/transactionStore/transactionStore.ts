import { create } from "zustand";
type TransactionType = "income" | "expense";

interface Transaction {
  transactionId: string; //PK
  walletId: string; //FK
  categoryId: string; //FK
  type: TransactionType;
  amount: number;
  date: string; // "2026-09-17T15:30:00"
  tagIds: string[]; //FK -> Tag[]
  description: string;
}

interface TransactionsStoreState {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, "transactionId">) => void;
  updateTransaction: (
    transactionId: string,
    transaction: Partial<Transaction>,
  ) => void;
  deleteTransaction: (transactionId: string) => void;
}

const useTransactionStore = create<TransactionsStoreState>((set, get) => ({
  transactions: [],
  addTransaction: (tx) => {
    const transactionId = crypto.randomUUID();
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...tx,
          transactionId,
        },
      ],
    }));
  },
  deleteTransaction: (transactionId) => {
    const exists = get().transactions.some(
      (tx) => tx.transactionId === transactionId,
    );

    if (!exists) {
      return false;
    }

    set((state) => ({
      transactions: state.transactions.filter(
        (tx) => tx.transactionId !== transactionId,
      ),
    }));

    return true;
  },
  updateTransaction: (transactionId, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((tx) => {
        if (tx.transactionId === transactionId) {
          return {
            ...tx,
            ...transaction,
          };
        }
        return tx;
      }),
    })),
}));

export default useTransactionStore;
