export type ProductCategory =
  | "Hoodies"
  | "T-Shirts"
  | "Jackets"
  | "Rings"
  | "Necklaces"
  | "Masks"
  | "Caps"
  | "Shoes"
  | "Posters"
  | "Figures"
  | "Keychains"
  | "Mousepads"
  | "Manga"
  | "Stickers"
  | "Cosplay"
  | "Limited Editions"
  | "Mystery Boxes";

export type AnimeSeries =
  | "Naruto"
  | "One Piece"
  | "Bleach"
  | "Attack on Titan"
  | "Demon Slayer"
  | "Jujutsu Kaisen"
  | "Solo Leveling"
  | "Dragon Ball"
  | "Chainsaw Man"
  | "Tokyo Ghoul"
  | "Death Note"
  | "Black Clover"
  | "My Hero Academia"
  | "Hunter x Hunter"
  | "Spy x Family"
  | "JoJo"
  | "Haikyuu"
  | "Vinland Saga"
  | "Blue Lock"
  | "One Punch Man";

export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
  priceModifier?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: ProductCategory;
  anime: AnimeSeries;
  images: string[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isLimited?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  tags: string[];
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}
