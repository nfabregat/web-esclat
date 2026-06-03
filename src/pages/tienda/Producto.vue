<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Minus, Plus, Search, ShoppingCart, X } from "lucide-vue-next";
import AccordionSection from "@/components/AccordionSection.vue";
import { formatShopPrice, getShopProduct, shopProducts, type ShopProduct } from "@/data/shop";
import { useShopCart, type CartItem } from "@/composables/useShopCart";

const route = useRoute();
const router = useRouter();
const { cartItems, cartCount, cartTotal, addToCart, incrementItem, decrementItem, getCartLineTotal, getCartProduct } =
  useShopCart();
const formatPrice = formatShopPrice;

const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const isSearchOpen = ref(false);
const isCartOpen = ref(false);
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

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return shopProducts;
  }

  return shopProducts.filter((shopProduct) => {
    const haystack = `${shopProduct.name} ${shopProduct.description} ${shopProduct.price}`.toLowerCase();
    return haystack.includes(query);
  });
});

const searchResults = computed(() => {
  const query = searchQuery.value.trim();
  if (!query) {
    return [];
  }

  return filteredProducts.value;
});

const recommendedProducts = computed(() => shopProducts.slice(0, 3));
const completeLookProducts = computed(() => shopProducts.slice(3, 6));
const cartEntries = computed(() =>
  cartItems.value
    .map((item) => ({
      item,
      product: getCartProduct(item.productId),
    }))
    .filter((entry): entry is { item: CartItem; product: ShopProduct } => Boolean(entry.product)),
);

const selectImage = (index: number) => {
  activeImageIndex.value = index;
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
    return;
  }

  router.push({ name: "tienda" });
};

const openSearch = () => {
  isCartOpen.value = false;
  isSearchOpen.value = true;
};

const closeSearch = () => {
  isSearchOpen.value = false;
};

const toggleSearch = () => {
  if (isSearchOpen.value) {
    closeSearch();
    return;
  }

  openSearch();
};

const openCart = () => {
  isSearchOpen.value = false;
  isCartOpen.value = true;
};

const closeCart = () => {
  isCartOpen.value = false;
};

const toggleCart = () => {
  if (isCartOpen.value) {
    closeCart();
    return;
  }

  openCart();
};

const openProductPage = (productId: string) => {
  closeSearch();
  closeCart();
  router.push({ name: "tienda-product", params: { productId } });
};

const goToCheckout = () => {
  if (cartItems.value.length === 0) return;

  router.push({
    name: "checkout",
    query: {
      productId: product.value?.id,
      size: selectedSize.value,
    },
  });
};

const addSelectedProductToCart = () => {
  if (!product.value) return;

  addToCart(product.value, selectedSize.value);
  openCart();
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;

  closeSearch();
  closeCart();
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
  [isSearchOpen, isCartOpen],
  async ([searchOpen, cartOpen]) => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = Boolean(searchOpen || cartOpen) ? "hidden" : "";

    if (searchOpen) {
      await nextTick();
      searchInputRef.value?.focus();
    }
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
  window.addEventListener("keydown", handleEscape);

  if (!product.value) {
    router.replace({ name: "tienda" });
  }
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
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
        <div class="product-toolbar">
          <button class="product-icon-button" type="button" aria-label="Volver atrás" @click="goBack">
            <ArrowLeft :size="22" />
          </button>

          <div class="product-toolbar-actions">
            <button
              class="product-icon-button"
              type="button"
              aria-label="Abrir buscador"
              @click.stop="toggleSearch"
            >
              <Search :size="22" />
            </button>

            <button
              class="product-icon-button"
              type="button"
              aria-label="Abrir carrito"
              @click.stop="toggleCart"
            >
              <ShoppingCart :size="22" />
              <span v-if="cartCount > 0" class="product-cart-badge">{{ cartCount }}</span>
            </button>
          </div>
        </div>

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

    <transition name="shop-panel">
      <div v-if="isSearchOpen" class="shop-search-backdrop" @click="closeSearch"></div>
    </transition>

    <transition name="shop-panel">
      <section v-if="isSearchOpen" class="shop-search-panel">
        <div class="shop-search-row">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            class="shop-search-input"
            type="text"
            placeholder="BUSCAR..."
            aria-label="Buscar productos"
          />

          <button
            class="shop-panel-close"
            type="button"
            aria-label="Cerrar buscador"
            @click="closeSearch"
          >
            <X :size="18" />
          </button>
        </div>

        <div class="shop-search-results">
          <button
            v-for="shopProduct in searchResults"
            :key="shopProduct.id"
            class="shop-search-result"
            type="button"
            @click="openProductPage(shopProduct.id)"
          >
            <span class="shop-search-result-name">{{ shopProduct.name }}</span>
            <span class="shop-search-result-price">{{ formatPrice(shopProduct.price) }}</span>
          </button>

          <p v-if="searchQuery.trim() && searchResults.length === 0" class="shop-search-empty">
            SIN RESULTADOS
          </p>
        </div>
      </section>
    </transition>

    <transition name="shop-drawer">
      <div v-if="isCartOpen" class="shop-drawer-backdrop" @click.self="closeCart">
        <aside class="shop-cart-drawer" role="dialog" aria-modal="true" aria-label="Carrito">
          <header class="shop-cart-header">
            <h2 class="shop-cart-title">CARRITO</h2>
            <button
              class="shop-panel-close"
              type="button"
              aria-label="Cerrar carrito"
              @click="closeCart"
            >
              <X :size="18" />
            </button>
          </header>

          <p class="shop-cart-shipping">ENVÍOS GRATIS EN LOS PEDIDOS DESDE 35,00€</p>
          <div class="shop-cart-divider"></div>

          <div class="shop-cart-body">
            <template v-if="cartItems.length === 0">
              <div class="shop-cart-empty">
                <p class="shop-cart-empty-title">TU CARRITO ESTÁ VACÍO</p>
                <p class="shop-cart-empty-subtitle">¿NO SABES POR DÓNDE EMPEZAR?</p>
              </div>

              <div class="shop-cart-section">
                <h3 class="shop-cart-section-title">RECOMENDADOS</h3>
                <div class="shop-mini-list">
                  <button
                    v-for="shopProduct in recommendedProducts"
                    :key="shopProduct.id"
                    class="shop-mini-product"
                    type="button"
                    @click="openProductPage(shopProduct.id)"
                  >
                    <img :src="shopProduct.images[0]" :alt="shopProduct.name" class="shop-mini-image" />
                    <span class="shop-mini-copy">
                      <span class="shop-mini-name">{{ shopProduct.name }}</span>
                      <span class="shop-mini-price">{{ formatPrice(shopProduct.price) }}</span>
                    </span>
                  </button>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="shop-cart-list">
                <article
                  v-for="entry in cartEntries"
                  :key="`${entry.item.productId}-${entry.item.size}`"
                  class="shop-cart-item"
                >
                  <img
                    :src="entry.product.images[0]"
                    :alt="entry.product.name"
                    class="shop-cart-thumb"
                  />

                  <div class="shop-cart-item-copy">
                    <p class="shop-cart-item-name">{{ entry.product.name }}</p>
                    <p class="shop-cart-item-meta">
                      <span>{{ entry.item.size }}</span>
                      <span>x{{ entry.item.quantity }}</span>
                    </p>
                  </div>

                  <div class="shop-cart-item-right">
                    <span class="shop-cart-item-price">{{ getCartLineTotal(entry.item) }}</span>
                    <div class="shop-cart-qty">
                      <button
                        class="shop-cart-qty-button"
                        type="button"
                        aria-label="Reducir cantidad"
                        @click="decrementItem(entry.item)"
                      >
                        <Minus :size="14" />
                      </button>
                      <button
                        class="shop-cart-qty-button"
                        type="button"
                        aria-label="Aumentar cantidad"
                        @click="incrementItem(entry.item)"
                      >
                        <Plus :size="14" />
                      </button>
                    </div>
                  </div>
                </article>
              </div>

              <div class="shop-cart-section">
                <h3 class="shop-cart-section-title">COMPLETA EL LOOK</h3>
                <div class="shop-mini-list">
                  <button
                    v-for="shopProduct in completeLookProducts"
                    :key="shopProduct.id"
                    class="shop-mini-product"
                    type="button"
                    @click="openProductPage(shopProduct.id)"
                  >
                    <img :src="shopProduct.images[0]" :alt="shopProduct.name" class="shop-mini-image" />
                    <span class="shop-mini-copy">
                      <span class="shop-mini-name">{{ shopProduct.name }}</span>
                      <span class="shop-mini-price">{{ formatPrice(shopProduct.price) }}</span>
                    </span>
                  </button>
                </div>
              </div>
            </template>
          </div>

          <div class="shop-cart-summary">
            <div class="shop-cart-total">
              <span>TOTAL</span>
              <strong>{{ formatPrice(cartTotal) }}</strong>
            </div>

            <button class="shop-pay-button" type="button" @click="goToCheckout">COMPRAR</button>
          </div>
        </aside>
      </div>
    </transition>
  </main>
</template>

<style scoped>
.product-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  --page-padding: max(24px, 3vw);
  --header-offset: 92px;
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
  gap: 24px;
  padding-top: 4px;
}

.product-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.product-toolbar-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.product-icon-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: opacity 180ms ease, transform 180ms ease;
}

.product-icon-button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.product-cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #fff;
  color: #000;
  font-family: "Roboto Mono", monospace;
  font-size: 9px;
  line-height: 14px;
  text-align: center;
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
  margin-top: 14px;
}

.shop-search-backdrop,
.shop-drawer-backdrop {
  position: fixed;
  inset: var(--header-offset) 0 0 0;
  z-index: 40;
}

.shop-search-backdrop {
  background: rgb(0 0 0 / 0.82);
}

.shop-search-panel {
  position: fixed;
  inset: var(--header-offset) 0 auto 0;
  z-index: 50;
  padding: 22px var(--page-padding) 26px;
  background-color: #000;
  border-bottom: 1px solid rgb(255 255 255 / 0.72);
}

.shop-search-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.shop-search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.72);
  background: transparent;
  color: #fff;
  font-family: "Roboto Mono", monospace;
  font-size: 16px;
  letter-spacing: 0.1em;
  padding: 14px 0 10px;
  text-transform: uppercase;
  outline: none;
}

.shop-search-input::placeholder {
  color: rgb(255 255 255 / 0.7);
}

.shop-panel-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: opacity 180ms ease, transform 180ms ease;
}

.shop-panel-close:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.shop-search-results {
  display: grid;
  gap: 10px;
  padding-top: 18px;
}

.shop-search-result {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.16);
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 10px 0 12px;
  text-align: left;
}

.shop-search-result:last-child {
  border-bottom: 0;
}

.shop-search-result-name,
.shop-search-result-price {
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.shop-search-result-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-search-result-price {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.shop-search-empty {
  margin: 0;
  padding-top: 6px;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: rgb(255 255 255 / 0.7);
}

.shop-drawer-backdrop {
  display: flex;
  justify-content: flex-end;
  background: rgb(0 0 0 / 0.35);
}

.shop-cart-drawer {
  width: min(520px, 100vw);
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #000;
  border-left: 1px solid rgb(255 255 255 / 0.16);
  padding: 18px 18px 22px;
}

.shop-cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.shop-cart-title {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.shop-cart-shipping {
  margin: 14px 0 0;
  padding: 12px 0 0;
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
}

.shop-cart-divider {
  margin-top: 10px;
  border-top: 1px solid rgb(255 255 255 / 0.28);
}

.shop-cart-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 18px;
  overflow-y: auto;
  padding-top: 12px;
}

.shop-cart-empty {
  display: grid;
  place-items: center;
  gap: 8px;
  min-height: 120px;
  text-align: center;
  padding-top: 6px;
}

.shop-cart-empty-title,
.shop-cart-empty-subtitle {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.14em;
}

.shop-cart-section {
  display: grid;
  gap: 16px;
}

.shop-cart-section-title {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.14em;
}

.shop-mini-list {
  display: grid;
  gap: 14px;
}

.shop-mini-product {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 16px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.shop-mini-image {
  width: 88px;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: #050505;
}

.shop-mini-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 4px 0;
  font-family: "Roboto Mono", monospace;
}

.shop-mini-name,
.shop-mini-price {
  font-size: 12px;
  letter-spacing: 0.08em;
}

.shop-mini-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shop-cart-list {
  display: grid;
  gap: 14px;
}

.shop-cart-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: start;
}

.shop-cart-thumb {
  width: 56px;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: #050505;
}

.shop-cart-item-copy {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.shop-cart-item-name,
.shop-cart-item-meta,
.shop-cart-item-price {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.shop-cart-item-meta {
  display: flex;
  gap: 10px;
  color: rgb(255 255 255 / 0.7);
}

.shop-cart-item-right {
  display: grid;
  justify-items: end;
  gap: 8px;
}

.shop-cart-qty {
  display: inline-flex;
  gap: 6px;
}

.shop-cart-qty-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid rgb(255 255 255 / 0.24);
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
}

.shop-cart-summary {
  margin-top: auto;
  padding-top: 20px;
}

.shop-cart-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.1em;
}

.shop-pay-button {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 0.55);
  background: #000;
  color: #fff;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  padding: 12px 16px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.shop-pay-button:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.shop-panel-enter-active,
.shop-panel-leave-active,
.shop-drawer-enter-active,
.shop-drawer-leave-active {
  transition: opacity 240ms ease, transform 240ms ease;
}

.shop-panel-enter-from,
.shop-panel-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.shop-drawer-enter-from,
.shop-drawer-leave-to {
  opacity: 0;
}

.shop-drawer-enter-from .shop-cart-drawer,
.shop-drawer-leave-to .shop-cart-drawer {
  transform: translateX(100%);
}

.shop-drawer-enter-active .shop-cart-drawer,
.shop-drawer-leave-active .shop-cart-drawer {
  transition: transform 260ms ease;
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

  .shop-search-panel {
    padding-top: 18px;
  }

  .shop-cart-drawer {
    width: min(100vw, 520px);
    padding: 16px 14px 18px;
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

  .shop-search-input {
    font-size: 14px;
  }

  .shop-cart-item {
    grid-template-columns: 64px minmax(0, 1fr) auto;
  }

  .shop-cart-thumb,
  .shop-mini-image {
    width: 64px;
  }

  .shop-cart-drawer {
    width: 100vw;
  }
}
</style>
