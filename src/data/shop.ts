export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  sizes: string[];
  accordions: ShopProductAccordion[];
};

export type ShopProductAccordion = {
  title: string;
  body: string;
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
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Botella reutilizable diseñada para acompañarte dentro y fuera del festival. Ligera, resistente y pensada para el uso diario, incorpora la identidad visual de ESCLAT en un formato funcional y sostenible.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar a mano antes del primer uso. No utilizar productos abrasivos ni introducir en lavavajillas para preservar el acabado exterior.",
      },
    ],
  },
  {
    id: "calcetines-identity",
    name: "CALCETINES ESCLAT IDENTITY",
    price: 12,
    images: [resolveAsset("Calcetines1.png")],
    description: "Calcetines ESCLAT IDENTITY con acabado cómodo y uso diario.",
    sizes: ["U"],
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Calcetines de diseño exclusivo inspirados en la identidad visual de ESCLAT. Confeccionados para ofrecer comodidad, transpirabilidad y un ajuste perfecto tanto para el día a día como para largas jornadas de festival.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar a máquina a baja temperatura. Evitar secadora y planchado para conservar los colores y la elasticidad del tejido.",
      },
    ],
  },
  {
    id: "calcetines-fusion",
    name: "CALCETINES ESCLAT FUSION",
    price: 12,
    images: [resolveAsset("Calcetines2.png")],
    description: "Calcetines ESCLAT FUSION con diseño limpio y versátil.",
    sizes: ["U"],
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Una reinterpretación de los códigos gráficos de ESCLAT aplicada a una pieza esencial. Diseñados para combinar comodidad, resistencia y una estética contemporánea inspirada en el universo del festival.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar a máquina a baja temperatura. Evitar secadora y planchado para mantener la calidad del tejido.",
      },
    ],
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
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Camiseta oficial de ESCLAT confeccionada en algodón de alta calidad. Una prenda de corte cómodo y diseño atemporal que traslada la estética del festival al día a día.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar del revés a un máximo de 30°C. No usar lejía y evitar la secadora para preservar el estampado.",
      },
    ],
  },
  {
    id: "gorro",
    name: "GORRO ESCLAT",
    price: 24,
    images: [resolveAsset("Gorro.png")],
    description: "Gorro ESCLAT con acabado sencillo y cómodo.",
    sizes: ["U"],
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Gorro de diseño minimalista inspirado en la estética underground y experimental del festival. Un accesorio versátil pensado para acompañarte durante cualquier temporada.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar a mano con agua fría. Secar al aire libre y evitar el uso de secadora.",
      },
    ],
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
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Top de inspiración contemporánea diseñado para combinar comodidad y estilo. Una pieza ligera que refleja la identidad visual de ESCLAT a través de una estética limpia y actual.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar a baja temperatura y evitar secadora. Planchar del revés si es necesario.",
      },
    ],
  },
  {
    id: "tote-bag",
    name: "TOTE BAG ESCLAT",
    price: 18,
    images: [resolveAsset("Tote-front.png")],
    description: "Tote bag ESCLAT para llevar lo esencial con estilo.",
    sizes: ["U"],
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Bolsa de tela reutilizable diseñada para el uso diario. Resistente, práctica y producida para acompañar el espíritu sostenible y creativo que define a ESCLAT.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Lavar a mano o en ciclo suave con agua fría. No utilizar secadora para evitar deformaciones.",
      },
    ],
  },
  {
    id: "vaso-esclat",
    name: "VASO ESCLAT",
    price: 3,
    images: [resolveAsset("Vaso1.png"), resolveAsset("Vaso2.png")],
    description: "Vaso ESCLAT con dos vistas para mantener la misma experiencia visual del catálogo.",
    sizes: ["U"],
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Vaso reutilizable diseñado para formar parte de la experiencia ESCLAT. Ligero, resistente y pensado para reducir el consumo de plásticos de un solo uso durante el festival.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Apto para lavado manual. Evitar temperaturas extremas para conservar su acabado original.",
      },
    ],
  },
  {
    id: "pegatinas-esclat",
    name: "PEGATINAS ESCLAT",
    price: 2,
    images: [resolveAsset("Pegatinas1.jpg"), resolveAsset("Pegatinas2.png")],
    description: "Pegatinas ESCLAT con dos imágenes para mantener el mismo patrón de producto.",
    sizes: ["U"],
    accordions: [
      {
        title: "DETALLES DEL PRODUCTO",
        body: "Pack de pegatinas inspirado en los símbolos, formas y elementos gráficos del universo visual de ESCLAT. Ideales para personalizar objetos cotidianos y llevar la identidad del festival contigo.",
      },
      {
        title: "ENVÍOS Y DEVOLUCIONES",
        body: "Envíos a toda España en un plazo de 3 a 5 días laborables. Se aceptan devoluciones dentro de los 14 días posteriores a la recepción del pedido siempre que el producto se encuentre en perfectas condiciones y sin uso.",
      },
      {
        title: "GUÍA DE CUIDADO",
        body: "Aplicar sobre superficies limpias y secas. Evitar la exposición prolongada a humedad o calor extremo para una mayor durabilidad.",
      },
    ],
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
