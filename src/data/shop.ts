export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  sizes: string[];
};

const resolveAsset = (fileName: string) => new URL(`../../data/MERCH/${fileName}`, import.meta.url).href;

export const shopProducts: ShopProduct[] = [
  {
    id: "botella",
    name: "BOTELLA ESCLAT",
    price: 18,
    images: [resolveAsset("BOTELLA DEF.png")],
    description: "Botella reutilizable ESCLAT para acompañarte en el día a día.",
    sizes: ["U"],
  },
  {
    id: "calcetines-identity",
    name: "CALCETINES ESCLAT IDENTITY",
    price: 12,
    images: [resolveAsset("CALCETINES DEF1.png")],
    description: "Calcetines ESCLAT IDENTITY con acabado cómodo y uso diario.",
    sizes: ["U"],
  },
  {
    id: "calcetines-fusion",
    name: "CALCETINES ESCLAT FUSION",
    price: 12,
    images: [resolveAsset("CALCETINES DEF.png")],
    description: "Calcetines ESCLAT FUSION con diseño limpio y versátil.",
    sizes: ["U"],
  },
  {
    id: "camiseta",
    name: "CAMISETA ESCLAT",
    price: 40,
    images: [
      resolveAsset("CAMISETA DELANTE DEF.png"),
      resolveAsset("CAMISETA DETRAS.png"),
    ],
    description: "Camiseta ESCLAT con vistas frontal y trasera.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "gorro",
    name: "GORRO ESCLAT",
    price: 24,
    images: [resolveAsset("GORRO DEF.png")],
    description: "Gorro ESCLAT con acabado sencillo y cómodo.",
    sizes: ["U"],
  },
  {
    id: "top",
    name: "TOP ESCLAT",
    price: 28,
    images: [
      resolveAsset("TOP DEF.png"),
      resolveAsset("TOP DETRAS DEF.png"),
    ],
    description: "Top ESCLAT con vistas frontal y trasera.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "tote-bag",
    name: "TOTE BAG ESCLAT",
    price: 18,
    images: [resolveAsset("TOTE DELANTE.png")],
    description: "Tote bag ESCLAT para llevar lo esencial con estilo.",
    sizes: ["U"],
  },
];

export const shopProductMap = Object.fromEntries(
  shopProducts.map((product) => [product.id, product] as const),
) as Record<string, ShopProduct>;

export const getShopProduct = (productId: string | undefined | null) => {
  if (!productId) return null;
  return shopProductMap[productId] ?? null;
};

export const formatShopPrice = (value: number) => {
  return `${value.toFixed(2).replace(".", ",")}€`;
};
