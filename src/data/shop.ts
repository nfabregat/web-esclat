export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  sizes: string[];
};

const resolveAsset = (fileName: string) => encodeURI(`/assets/Merch/${fileName}`);

export const shopProducts: ShopProduct[] = [
  {
    id: "botella",
    name: "BOTELLA ESCLAT",
    price: 18,
    images: [resolveAsset("Botella.png")],
    description: "Botella reutilizable ESCLAT para acompañarte en el día a día.",
    sizes: ["U"],
  },
  {
    id: "calcetines-identity",
    name: "CALCETINES ESCLAT IDENTITY",
    price: 12,
    images: [resolveAsset("Calcetines1.png")],
    description: "Calcetines ESCLAT IDENTITY con acabado cómodo y uso diario.",
    sizes: ["U"],
  },
  {
    id: "calcetines-fusion",
    name: "CALCETINES ESCLAT FUSION",
    price: 12,
    images: [resolveAsset("Calcetines2.png")],
    description: "Calcetines ESCLAT FUSION con diseño limpio y versátil.",
    sizes: ["U"],
  },
  {
    id: "camiseta",
    name: "CAMISETA ESCLAT",
    price: 40,
    images: [
      resolveAsset("Camiseta-front.png"),
      resolveAsset("Camiseta-back.png"),
    ],
    description: "Camiseta ESCLAT con vistas frontal y trasera.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "gorro",
    name: "GORRO ESCLAT",
    price: 24,
    images: [resolveAsset("Gorro.png")],
    description: "Gorro ESCLAT con acabado sencillo y cómodo.",
    sizes: ["U"],
  },
  {
    id: "top",
    name: "TOP ESCLAT",
    price: 28,
    images: [
      resolveAsset("Top-front.png"),
      resolveAsset("Top-back.png"),
    ],
    description: "Top ESCLAT con vistas frontal y trasera.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "tote-bag",
    name: "TOTE BAG ESCLAT",
    price: 18,
    images: [resolveAsset("Tote-front.png")],
    description: "Tote bag ESCLAT para llevar lo esencial con estilo.",
    sizes: ["U"],
  },
  {
    id: "vaso-esclat",
    name: "VASO ESCLAT",
    price: 3,
    images: [resolveAsset("Vaso1.png"), resolveAsset("Vaso2.png")],
    description: "Vaso ESCLAT con dos vistas para mantener la misma experiencia visual del catálogo.",
    sizes: ["U"],
  },
  {
    id: "pegatinas-esclat",
    name: "PEGATINAS ESCLAT",
    price: 2,
    images: [resolveAsset("Pegatinas1.jpg"), resolveAsset("Pegatinas2.png")],
    description: "Pegatinas ESCLAT con dos imágenes para mantener el mismo patrón de producto.",
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
