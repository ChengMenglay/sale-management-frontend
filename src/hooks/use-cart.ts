import { toast } from "react-toastify";
import { Product } from "../../type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
interface CartStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: number) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItem = get().items;
        const existingItem = currentItem.find((item) => item.id === data.id);
        if (existingItem) {
          return toast.info("Item already in cart!");
        }
        set({ items: [...get().items, data] });
      },
      removeItem: (id: number) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },
      removeAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-sale-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
