import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
  slug: string;
  title: string;
  image: string;
  price: number;
  anime: string;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addViewed: (item: RecentlyViewedItem) => void;
}

const MAX_ITEMS = 8;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addViewed: (item) =>
        set((state) => {
          const withoutDupe = state.items.filter((i) => i.slug !== item.slug);
          return { items: [item, ...withoutDupe].slice(0, MAX_ITEMS) };
        }),
    }),
    { name: "anime-luxe-recently-viewed" }
  )
);
