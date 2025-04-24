import { toast } from "react-toastify";
import { Product } from "../../type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface CartStore {
  items: Product[];
  discount?: {
    type: "percent" | "amount";
    value: number;
  };
  note?: string;
  addItem: (data: Product) => void;
  removeItem: (id: number) => void;
  removeAllItem: () => void;
  removeAll: () => void;
  setDiscount: (type: "percent" | "amount", value: number) => void;
  setNote: (value: string) => void;
  removeDiscount: () => void;
  removeNote: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      discount: undefined,
      note: undefined,
      addItem: (data: Product) => {
        const currentItem = get().items;
        const existingItem = currentItem.find((item) => item.id === data.id);
        if (existingItem) {
          return toast.info("Item already in cart!");
        }
        set({ items: [...get().items, data] });
      },
      removeItem: (id: number) => {
        set({
          items: [...get().items.filter((item) => item.id !== id)],
        });
      },
      removeAllItem: () => {
        set({ items: [] });
      },
      removeAll: () => {
        set({ items: [], discount: undefined, note: undefined });
      },
      setDiscount: (type, value) => set({ discount: { type, value } }),
      setNote: (value: string) => set(() => ({ note: value })),
      removeDiscount: () => {
        set({ discount: undefined });
      },
      removeNote: () => {
        set({ note: undefined });
      },
    }),
    {
      name: "cart-sale-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
