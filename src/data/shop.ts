export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  sizes: string[];
};

const resolveAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const shopProducts: ShopProduct[] = [
  {
    id: "camiseta",
    name: "CAMISETA ESCLAT",
    price: 40,
    images: [
      resolveAsset("/assets/artistas/1.jpg"),
      resolveAsset("/assets/artistas/2.jpg"),
      resolveAsset("/assets/artistas/3.jpg"),
      resolveAsset("/assets/artistas/4.jpg"),
    ],
    description: "Camiseta de corte recto con gráfica central ESCLAT y algodón pesado.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "gorra",
    name: "GORRA ESCLAT",
    price: 30,
    images: [
      resolveAsset("/assets/artistas/5.jpg"),
      resolveAsset("/assets/artistas/6.jpg"),
      resolveAsset("/assets/artistas/7.jpg"),
      resolveAsset("/assets/artistas/8.jpg"),
    ],
    description: "Gorra de perfil bajo con bordado frontal y ajuste trasero regulable.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "sudadera",
    name: "SUDADERA ESCLAT",
    price: 48,
    images: [
      resolveAsset("/assets/artistas/9.jpg"),
      resolveAsset("/assets/artistas/10.jpg"),
      resolveAsset("/assets/artistas/11.jpg"),
      resolveAsset("/assets/artistas/12.jpg"),
    ],
    description: "Sudadera oversize con felpa interior y tacto pesado para una silueta premium.",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "tote",
    name: "TOTE BAG",
    price: 18,
    images: [
      resolveAsset("/assets/artistas/13.jpg"),
      resolveAsset("/assets/artistas/14.jpg"),
      resolveAsset("/assets/artistas/15.jpg"),
      resolveAsset("/assets/artistas/16.jpg"),
    ],
    description: "Tote bag de lona resistente para uso diario, archivos y vinilos.",
    sizes: ["U"],
  },
  {
    id: "vinilo",
    name: "VINILO",
    price: 35,
    images: [
      resolveAsset("/assets/artistas/17.jpg"),
      resolveAsset("/assets/artistas/18.jpg"),
      resolveAsset("/assets/artistas/19.jpg"),
      resolveAsset("/assets/artistas/20.jpg"),
    ],
    description: "Edición física con selección musical del universo ESCLAT.",
    sizes: ["U"],
  },
  {
    id: "poster",
    name: "POSTER",
    price: 12,
    images: [
      resolveAsset("/assets/artistas/21.jpg"),
      resolveAsset("/assets/artistas/22.jpg"),
      resolveAsset("/assets/artistas/23.jpg"),
      resolveAsset("/assets/artistas/24.jpg"),
    ],
    description: "Póster de edición limitada impreso en papel de alto gramaje.",
    sizes: ["30x40"],
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
