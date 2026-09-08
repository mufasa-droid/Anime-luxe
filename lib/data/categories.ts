import type { AnimeSeries, ProductCategory } from "@/types";

export interface CategoryMeta {
  name: ProductCategory;
  slug: string;
  icon: string;
  image: string;
  description?: string;
}

export const PRODUCT_CATEGORIES: CategoryMeta[] = [
  {
    name: "Hoodies",
    slug: "hoodies",
    icon: "shirt",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    description: "400gsm heavyweight fleece & embroidered drops",
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    icon: "shirt",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    description: "Acid wash & oversized vintage graphic tees",
  },
  {
    name: "Jackets",
    slug: "jackets",
    icon: "shirt",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    description: "Technical trench coats & bomber jackets",
  },
  {
    name: "Rings",
    slug: "rings",
    icon: "gem",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
    description: "Solid 925 sterling silver engraved signets",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    icon: "gem",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    description: "Cuban link chains & anime talisman pendants",
  },
  {
    name: "Masks",
    slug: "masks",
    icon: "drama",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
    description: "Cyberpunk & traditional oni samurai masks",
  },
  {
    name: "Caps",
    slug: "caps",
    icon: "crown",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
    description: "Distressed dad hats & embroidered strapbacks",
  },
  {
    name: "Shoes",
    slug: "shoes",
    icon: "footprints",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
    description: "Custom anime silhouette leather sneakers",
  },
  {
    name: "Posters",
    slug: "posters",
    icon: "image",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    description: "Metallic foil art prints & museum grade canvases",
  },
  {
    name: "Figures",
    slug: "figures",
    icon: "box",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    description: "1/6 scale PVC statues & limited resin sculptures",
  },
  {
    name: "Keychains",
    slug: "keychains",
    icon: "key",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80",
    description: "Solid zinc alloy key charms & woven lanyards",
  },
  {
    name: "Mousepads",
    slug: "mousepads",
    icon: "mouse",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
    description: "XL speed-stitched gaming desk mats",
  },
  {
    name: "Manga",
    slug: "manga",
    icon: "book",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    description: "Hardcover box sets & exclusive art books",
  },
  {
    name: "Stickers",
    slug: "stickers",
    icon: "sticker",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=600&q=80",
    description: "Holographic weatherproof vinyl packs",
  },
  {
    name: "Cosplay",
    slug: "cosplay",
    icon: "sparkles",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    description: "Screen-accurate robes, haori & props",
  },
  {
    name: "Limited Editions",
    slug: "limited-editions",
    icon: "flame",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
    description: "Numbered collector pieces with NFC certificates",
  },
  {
    name: "Mystery Boxes",
    slug: "mystery-boxes",
    icon: "package",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80",
    description: "Curated anime loot tiers guaranteed $150+ value",
  },
];

export interface AnimeMeta {
  name: AnimeSeries;
  slug: string;
  color: string; // accent color for that series' shop-by-anime card
  image?: string;
}

export const ANIME_SERIES: AnimeMeta[] = [
  {
    name: "Naruto",
    slug: "naruto",
    color: "#F5B700",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "One Piece",
    slug: "one-piece",
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Bleach",
    slug: "bleach",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Attack on Titan",
    slug: "attack-on-titan",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Demon Slayer",
    slug: "demon-slayer",
    color: "#22C55E",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Solo Leveling",
    slug: "solo-leveling",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Dragon Ball",
    slug: "dragon-ball",
    color: "#F5B700",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Chainsaw Man",
    slug: "chainsaw-man",
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Tokyo Ghoul",
    slug: "tokyo-ghoul",
    color: "#EC4899",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Death Note",
    slug: "death-note",
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Black Clover",
    slug: "black-clover",
    color: "#181818",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "My Hero Academia",
    slug: "my-hero-academia",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hunter x Hunter",
    slug: "hunter-x-hunter",
    color: "#22C55E",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Spy x Family",
    slug: "spy-x-family",
    color: "#EC4899",
    image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "JoJo",
    slug: "jojo",
    color: "#F5B700",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Haikyuu",
    slug: "haikyuu",
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Vinland Saga",
    slug: "vinland-saga",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Blue Lock",
    slug: "blue-lock",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "One Punch Man",
    slug: "one-punch-man",
    color: "#F5B700",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80",
  },
];
