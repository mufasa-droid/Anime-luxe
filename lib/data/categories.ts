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
    image: "/images/products/killua-zoldyck-slurp-heavyweight-hoodie.jpeg",
    description: "400gsm heavyweight fleece & embroidered drops",
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    icon: "shirt",
    image: "/images/products/asta-demon-eyes-oversized-tee.jpeg",
    description: "Acid wash & oversized vintage graphic tees",
  },
  {
    name: "Jackets",
    slug: "jackets",
    icon: "shirt",
    image: "/images/products/itachi-blood-moon-full-zip-jacket.jpeg",
    description: "Technical trench coats & bomber jackets",
  },
  {
    name: "Shorts",
    slug: "shorts",
    icon: "shirt",
    image: "/images/products/akatsuki-red-cloud-fleece-shorts.jpeg",
    description: "Heavyweight French terry anime lounge & streetwear sweatshorts",
  },
  {
    name: "Rings",
    slug: "rings",
    icon: "gem",
    image: "/images/categories/rings.jpg",
    description: "Solid 925 sterling silver engraved signets",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    icon: "gem",
    image: "/images/categories/necklaces.jpg",
    description: "Cuban link chains & anime talisman pendants",
  },
  {
    name: "Masks",
    slug: "masks",
    icon: "drama",
    image: "/images/categories/masks.jpg",
    description: "Cyberpunk & traditional oni samurai masks",
  },
  {
    name: "Caps",
    slug: "caps",
    icon: "crown",
    image: "/images/products/black-clover-five-leaf-trucker-cap.jpeg",
    description: "Distressed dad hats & embroidered strapbacks",
  },
  {
    name: "Shoes",
    slug: "shoes",
    icon: "footprints",
    image: "/images/categories/shoes.jpg",
    description: "Custom anime silhouette leather sneakers",
  },
  {
    name: "Posters",
    slug: "posters",
    icon: "image",
    image: "/images/categories/posters.jpg",
    description: "Metallic foil art prints & museum grade canvases",
  },
  {
    name: "Figures",
    slug: "figures",
    icon: "box",
    image: "/images/categories/figures.jpg",
    description: "1/6 scale PVC statues & limited resin sculptures",
  },
  {
    name: "Keychains",
    slug: "keychains",
    icon: "key",
    image: "/images/categories/keychains.jpg",
    description: "Solid zinc alloy key charms & woven lanyards",
  },
  {
    name: "Mousepads",
    slug: "mousepads",
    icon: "mouse",
    image: "/images/categories/mousepads.jpg",
    description: "XL speed-stitched gaming desk mats",
  },
  {
    name: "Manga",
    slug: "manga",
    icon: "book",
    image: "/images/categories/manga.jpg",
    description: "Hardcover box sets & exclusive art books",
  },
  {
    name: "Stickers",
    slug: "stickers",
    icon: "sticker",
    image: "/images/categories/stickers.jpg",
    description: "Holographic weatherproof vinyl packs",
  },
  {
    name: "Cosplay",
    slug: "cosplay",
    icon: "sparkles",
    image: "/images/categories/cosplay.jpg",
    description: "Screen-accurate robes, haori & props",
  },
  {
    name: "Limited Editions",
    slug: "limited-editions",
    icon: "flame",
    image: "/images/categories/limited-editions.jpg",
    description: "Numbered collector pieces with NFC certificates",
  },
  {
    name: "Mystery Boxes",
    slug: "mystery-boxes",
    icon: "package",
    image: "/images/categories/mystery-boxes.jpg",
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
    image: "/images/anime/naruto.jpg",
  },
  {
    name: "One Piece",
    slug: "one-piece",
    color: "#EF4444",
    image: "/images/anime/one-piece.jpg",
  },
  {
    name: "Bleach",
    slug: "bleach",
    color: "#3B82F6",
    image: "/images/anime/bleach.jpg",
  },
  {
    name: "Attack on Titan",
    slug: "attack-on-titan",
    color: "#8B5CF6",
    image: "/images/anime/attack-on-titan.jpg",
  },
  {
    name: "Demon Slayer",
    slug: "demon-slayer",
    color: "#22C55E",
    image: "/images/anime/demon-slayer.jpg",
  },
  {
    name: "Jujutsu Kaisen",
    slug: "jujutsu-kaisen",
    color: "#8B5CF6",
    image: "/images/anime/jujutsu-kaisen.jpg",
  },
  {
    name: "Solo Leveling",
    slug: "solo-leveling",
    color: "#3B82F6",
    image: "/images/anime/solo-leveling.png",
  },
  {
    name: "Dragon Ball",
    slug: "dragon-ball",
    color: "#F5B700",
    image: "/images/anime/dragon-ball.jpg",
  },
  {
    name: "Chainsaw Man",
    slug: "chainsaw-man",
    color: "#EF4444",
    image: "/images/anime/chainsaw-man.png",
  },
  {
    name: "Tokyo Ghoul",
    slug: "tokyo-ghoul",
    color: "#EC4899",
    image: "/images/products/itachi-tsukuyomi-hand-sign-split-hoodie.jpeg",
  },
  {
    name: "Death Note",
    slug: "death-note",
    color: "#EF4444",
    image: "/images/anime/death-note.png",
  },
  {
    name: "Black Clover",
    slug: "black-clover",
    color: "#181818",
    image: "/images/anime/black-clover.png",
  },
  {
    name: "My Hero Academia",
    slug: "my-hero-academia",
    color: "#3B82F6",
    image: "/images/anime/my-hero-academia.jpg",
  },
  {
    name: "Hunter x Hunter",
    slug: "hunter-x-hunter",
    color: "#22C55E",
    image: "/images/anime/hunter-x-hunter.jpg",
  },
  {
    name: "Fire Force",
    slug: "fire-force",
    color: "#F97316",
    image: "/images/anime/fire-force.jpg",
  },
  {
    name: "Baki",
    slug: "baki",
    color: "#DC2626",
    image: "/images/anime/baki.png",
  },
  {
    name: "Mob Psycho 100",
    slug: "mob-psycho-100",
    color: "#8B5CF6",
    image: "/images/anime/mob-psycho-100.jpg",
  },
  {
    name: "Spy x Family",
    slug: "spy-x-family",
    color: "#EC4899",
    image: "/images/products/killua-zoldyck-white-front-back-tee.jpeg",
  },
  {
    name: "JoJo",
    slug: "jojo",
    color: "#F5B700",
    image: "/images/products/kurapika-scarlet-eyes-chains-tee.jpeg",
  },
  {
    name: "Haikyuu",
    slug: "haikyuu",
    color: "#EF4444",
    image: "/images/anime/haikyuu.jpg",
  },
  {
    name: "Vinland Saga",
    slug: "vinland-saga",
    color: "#8B5CF6",
    image: "/images/anime/vinland-saga.png",
  },
  {
    name: "Blue Lock",
    slug: "blue-lock",
    color: "#3B82F6",
    image: "/images/anime/blue-lock.png",
  },
  {
    name: "One Punch Man",
    slug: "one-punch-man",
    color: "#F5B700",
    image: "/images/products/saitama-hero-uppercut-graphic-tee.jpeg",
  },
];
