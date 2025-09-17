import { create } from 'zustand';

interface MoneyState {
    money: number;
    addMoney: (amount: number) => void;
    spendMoney: (amount: number) => void;
    setMoney: (amount: number) => void;
}

const useMoneyStore = create<MoneyState>((set, get) => ({
    money: 0,
    addMoney: (amount: number) => set((state) => ({ money: state.money + amount })),
    spendMoney: (amount: number) => {
        const next = get().money - amount;
        set({ money: next < 0 ? 0 : next });
    },
    setMoney: (amount: number) => set({ money: amount }),
}));

export default useMoneyStore;


