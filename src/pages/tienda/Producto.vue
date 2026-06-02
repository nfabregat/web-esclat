<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import AccordionSection from "@/components/AccordionSection.vue";
import { formatShopPrice, getShopProduct } from "@/data/shop";
import { useShopCart } from "@/composables/useShopCart";

const route = useRoute();
const router = useRouter();
const { addToCart } = useShopCart();

const activeImageIndex = ref(0);
const selectedSize = ref("");

const product = computed(() => getShopProduct(route.params.productId as string | undefined));

const detailPrice = computed(() => {
  return formatShopPrice(product.value?.price ?? 0).replace("€", " €");
});

const activeImage = computed(() => {
  const images = product.value?.images ?? [];
  return images[activeImageIndex.value] ?? images[0] ?? "";
});

const thumbnails = computed(() => product.value?.images ?? []);

const selectImage = (index: number) => {
  activeImageIndex.value = index;
};

const addSelectedProductToCart = () => {
  if (!product.value) return;

  addToCart(product.value, selectedSize.value);
};

watch(
  product,
  (currentProduct) => {
    if (!currentProduct) return;

    activeImageIndex.value = 0;
    selectedSize.value = currentProduct.sizes[0] ?? "";
  },
  { immediate: true },
);

watch(
  () => route.params.productId,
  (productId) => {
    if (typeof productId !== "string" || !getShopProduct(productId)) {
      router.replace({ name: "tienda" });
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!product.value) {
    router.replace({ name: "tienda" });
  }
});
</script>

<template>
  <main class="product-page">
    <section v-if="product" class="product-shell">
      <div class="product-gallery">
        <div class="product-thumbnails" aria-label="Miniaturas del producto">
          <button
            v-for="(image, index) in thumbnails"
            :key="image"
            class="product-thumbnail"
            :class="{ 'is-active': activeImageIndex === index }"
            type="button"
            :aria-label="`Ver imagen ${index + 1}`"
            @click="selectImage(index)"
          >
            <img :src="image" :alt="`${product.name} vista ${index + 1}`" />
          </button>
        </div>

        <figure class="product-figure">
          <img :src="activeImage" :alt="product.name" class="product-image" />
        </figure>
      </div>

      <aside class="product-info">
        <RouterLink class="product-back font-monument" to="/tienda">TIENDA</RouterLink>

        <div class="product-heading">
          <p class="product-kicker">ESCLAT</p>
          <h1 class="product-name">{{ product.name }}</h1>
          <p class="product-price">{{ detailPrice }}</p>
        </div>

        <div class="product-sizes" aria-label="Selector de tallas">
          <button
            v-for="size in product.sizes"
            :key="size"
            class="product-size"
            :class="{ 'is-active': selectedSize === size }"
            type="button"
            @click="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>

        <button class="product-add" type="button" @click="addSelectedProductToCart">
          AÑADIR AL CARRITO
        </button>

        <div class="product-accordions">
          <AccordionSection
            title="DETALLES DEL PRODUCTO"
            body="Aquí va la información del producto, estamos trabajando en ello. En breves estará listo."
          />
          <AccordionSection
            title="ENVÍOS Y DEVOLUCIONES"
            body="Aquí va la información del producto, estamos trabajando en ello. En breves estará listo."
          />
          <AccordionSection
            title="GUÍA DE CUIDADO"
            body="Aquí va la información del producto, estamos trabajando en ello. En breves estará listo."
          />
        </div>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.product-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  --page-padding: max(24px, 3vw);
}

.product-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(340px, 0.82fr);
  gap: 42px;
  padding: 8vh var(--page-padding) 12vh;
}

.product-gallery {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.product-thumbnails {
  display: grid;
  gap: 12px;
}

.product-thumbnail {
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  padding: 0;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  transition: border-color 180ms ease, opacity 180ms ease;
}

.product-thumbnail:hover,
.product-thumbnail.is-active {
  border-color: rgb(255 255 255 / 0.6);
}

.product-thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.86;
}

.product-thumbnail.is-active img,
.product-thumbnail:hover img {
  opacity: 1;
}

.product-figure {
  margin: 0;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: #060606;
}

.product-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 300ms ease, opacity 220ms ease;
}

.product-figure:hover .product-image {
  transform: scale(1.02);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding-top: 4px;
}

.product-back {
  align-self: flex-start;
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-decoration: none;
}

.product-back:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.product-heading {
  display: grid;
  gap: 10px;
}

.product-kicker {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: rgb(255 255 255 / 0.72);
}

.product-name {
  margin: 0;
  font-size: clamp(30px, 3.4vw, 54px);
  font-weight: 400;
  line-height: 0.98;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-price {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 18px;
  letter-spacing: 0.08em;
}

.product-sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
}

.product-size {
  position: relative;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  letter-spacing: 0.14em;
  padding: 0 0 8px;
}

.product-size::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms ease;
}

.product-size:hover::after,
.product-size.is-active::after {
  transform: scaleX(1);
}

.product-add {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 0.48);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.18em;
  padding: 14px 18px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.product-add:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.product-accordions {
  display: grid;
}

@media (max-width: 1024px) {
  .product-shell {
    grid-template-columns: 1fr;
    gap: 26px;
    padding-top: 6vh;
  }

  .product-gallery {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .product-thumbnails {
    grid-auto-flow: column;
    grid-auto-columns: 84px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .product-info {
    gap: 22px;
  }

  .product-name {
    font-size: clamp(26px, 9vw, 44px);
  }
}

@media (max-width: 760px) {
  .product-shell {
    padding: 4vh var(--page-padding) 10vh;
  }

  .product-thumbnails {
    grid-auto-columns: 72px;
  }

  .product-price {
    font-size: 16px;
  }

  .product-size {
    font-size: 12px;
  }
}
</style>
