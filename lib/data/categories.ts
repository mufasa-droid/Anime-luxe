import type { AnimeSeries, ProductCategory } from "@/types";

export interface CategoryMeta {
  name: ProductCategory;
  slug: string;
  icon: string;
}

export const PRODUCT_CATEGORIES: CategoryMeta[] = [
  { name: "Hoodies", slug: "hoodies", icon: "shirt" },
  { name: "T-Shirts", slug: "t-shirts", icon: "shirt" },
  { name: "Jackets", slug: "jackets", icon: "shirt" },
  { name: "Rings", slug: "rings", icon: "gem" },
  { name: "Necklaces", slug: "necklaces", icon: "gem" },
  { name: "Masks", slug: "masks", icon: "drama" },
  { name: "Caps", slug: "caps", icon: "crown" },
  { name: "Shoes", slug: "shoes", icon: "footprints" },
  { name: "Posters", slug: "posters", icon: "image" },
  { name: "Figures", slug: "figures", icon: "box" },
  { name: "Keychains", slug: "keychains", icon: "key" },
  { name: "Mousepads", slug: "mousepads", icon: "mouse" },
  { name: "Manga", slug: "manga", icon: "book" },
  { name: "Stickers", slug: "stickers", icon: "sticker" },
  { name: "Cosplay", slug: "cosplay", icon: "sparkles" },
  { name: "Limited Editions", slug: "limited-editions", icon: "flame" },
  { name: "Mystery Boxes", slug: "mystery-boxes", icon: "package" },
];

export interface AnimeMeta {
  name: AnimeSeries;
  slug: string;
  color: string; // accent color for that series' shop-by-anime card
}

export const ANIME_SERIES: AnimeMeta[] = [
  { name: "Naruto", slug: "naruto", color: "#F5B700" },
  { name: "One Piece", slug: "one-piece", color: "#EF4444" },
  { name: "Bleach", slug: "bleach", color: "#3B82F6" },
  { name: "Attack on Titan", slug: "attack-on-titan", color: "#8B5CF6" },
  { name: "Demon Slayer", slug: "demon-slayer", color: "#22C55E" },
  { name: "Jujutsu Kaisen", slug: "jujutsu-kaisen", color: "#8B5CF6" },
  { name: "Solo Leveling", slug: "solo-leveling", color: "#3B82F6" },
  { name: "Dragon Ball", slug: "dragon-ball", color: "#F5B700" },
  { name: "Chainsaw Man", slug: "chainsaw-man", color: "#EF4444" },
  { name: "Tokyo Ghoul", slug: "tokyo-ghoul", color: "#EC4899" },
  { name: "Death Note", slug: "death-note", color: "#EF4444" },
  { name: "Black Clover", slug: "black-clover", color: "#181818" },
  { name: "My Hero Academia", slug: "my-hero-academia", color: "#3B82F6" },
  { name: "Hunter x Hunter", slug: "hunter-x-hunter", color: "#22C55E" },
  { name: "Spy x Family", slug: "spy-x-family", color: "#EC4899" },
  { name: "JoJo", slug: "jojo", color: "#F5B700" },
  { name: "Haikyuu", slug: "haikyuu", color: "#EF4444" },
  { name: "Vinland Saga", slug: "vinland-saga", color: "#8B5CF6" },
  { name: "Blue Lock", slug: "blue-lock", color: "#3B82F6" },
  { name: "One Punch Man", slug: "one-punch-man", color: "#F5B700" },
];
