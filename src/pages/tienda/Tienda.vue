<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { Search, ShoppingCart, X, Minus, Plus } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { formatShopPrice, shopProducts, type ShopProduct } from "@/data/shop";
import { useShopCart, type CartItem } from "@/composables/useShopCart";

const router = useRouter();
const route = useRoute();
const { cartItems, cartCount, cartTotal, incrementItem, decrementItem, getCartLineTotal, getCartProduct } =
  useShopCart();
const formatPrice = formatShopPrice;

const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const isSearchOpen = ref(false);
const isCartOpen = ref(false);
const shopScrollKeyPrefix = "esclat-shop-scroll:";

const getHistoryPosition = () => {
  if (typeof window === "undefined") return null;

  const position = window.history.state?.position;
  return typeof position === "number" ? position : null;
};

const saveShopScrollPosition = () => {
  if (typeof window === "undefined") return;

  const position = getHistoryPosition();
  if (position === null) return;

  window.sessionStorage.setItem(`${shopScrollKeyPrefix}${position}`, String(window.scrollY));
};

const restoreShopScrollPosition = async () => {
  if (typeof window === "undefined") return;

  const position = getHistoryPosition();
  if (position === null) return;

  const storedScroll = window.sessionStorage.getItem(`${shopScrollKeyPrefix}${position}`);
  if (storedScroll === null) return;

  window.sessionStorage.removeItem(`${shopScrollKeyPrefix}${position}`);

  const targetScroll = Number(storedScroll);
  if (!Number.isFinite(targetScroll)) return;

  await nextTick();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetScroll, behavior: "auto" });
    });
  });
};

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return shopProducts;
  }

  return shopProducts.filter((product) => {
    const haystack = `${product.name} ${product.description} ${product.price}`.toLowerCase();
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

const closeSearch = () => {
  isSearchOpen.value = false;
};

const openSearch = () => {
  isCartOpen.value = false;
  isSearchOpen.value = true;
};

const toggleSearch = () => {
  if (isSearchOpen.value) {
    closeSearch();
    return;
  }

  openSearch();
};

const closeCart = () => {
  isCartOpen.value = false;
};

const openCart = () => {
  isSearchOpen.value = false;
  isCartOpen.value = true;
};

const goToCheckout = () => {
  if (cartItems.value.length === 0) return;

  saveShopScrollPosition();
  const firstEntry = cartEntries.value[0];

  router.push({
    name: "checkout",
    query: firstEntry
      ? {
          productId: firstEntry.item.productId,
          size: firstEntry.item.size,
        }
      : undefined,
  });
};

const toggleCart = () => {
  if (isCartOpen.value) {
    closeCart();
    return;
  }

  openCart();
};

const openProductPage = (productId: string) => {
  saveShopScrollPosition();
  closeSearch();
  closeCart();
  router.push({ name: "tienda-product", params: { productId } });
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;

  closeSearch();
  closeCart();
};

watch(
  () => route.query.cart,
  (cartQuery) => {
    if (cartQuery === "open") {
      openCart();
    }
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

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
  void restoreShopScrollPosition();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <main class="shop-page">
    <section class="shop-hero">
      <h1 class="shop-title font-monument">TIENDA</h1>
    </section>

    <section class="shop-catalog">
      <div class="shop-toolbar">
        <button
          class="shop-icon-button"
          type="button"
          aria-label="Abrir buscador"
          @click.stop="toggleSearch"
        >
          <Search :size="22" />
        </button>

        <button
          class="shop-icon-button"
          type="button"
          aria-label="Abrir carrito"
          @click.stop="toggleCart"
        >
          <ShoppingCart :size="22" />
          <span v-if="cartCount > 0" class="shop-cart-badge">{{ cartCount }}</span>
        </button>
      </div>

      <p v-if="filteredProducts.length === 0" class="shop-no-results font-monument">
        NO SE HAN ENCONTRADO PRODUCTOS
      </p>

      <div v-else class="shop-grid">
        <button
          v-for="product in filteredProducts"
          :key="product.id"
          class="shop-product"
          type="button"
          @click="openProductPage(product.id)"
        >
          <span class="shop-product-visual">
            <img
              :src="product.images[0]"
              :alt="product.name"
              class="shop-product-image shop-product-image--primary"
            />
            <img
              :src="product.images[1] ?? product.images[0]"
              :alt="product.name"
              class="shop-product-image shop-product-image--secondary"
            />
          </span>

          <span class="shop-product-meta">
            <span class="shop-product-name">{{ product.name }}</span>
            <span class="shop-product-price">{{ formatPrice(product.price) }}</span>
          </span>
        </button>
      </div>
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
            v-for="product in searchResults"
            :key="product.id"
            class="shop-search-result"
            type="button"
            @click="openProductPage(product.id)"
          >
            <span class="shop-search-result-name">{{ product.name }}</span>
            <span class="shop-search-result-price">{{ formatPrice(product.price) }}</span>
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
                    v-for="product in recommendedProducts"
                    :key="product.id"
                    class="shop-mini-product"
                    type="button"
                    @click="openProductPage(product.id)"
                  >
                    <img :src="product.images[0]" :alt="product.name" class="shop-mini-image" />
                    <span class="shop-mini-copy">
                      <span class="shop-mini-name">{{ product.name }}</span>
                      <span class="shop-mini-price">{{ formatPrice(product.price) }}</span>
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
                    v-for="product in completeLookProducts"
                    :key="product.id"
                    class="shop-mini-product"
                    type="button"
                    @click="openProductPage(product.id)"
                  >
                    <img :src="product.images[0]" :alt="product.name" class="shop-mini-image" />
                    <span class="shop-mini-copy">
                      <span class="shop-mini-name">{{ product.name }}</span>
                      <span class="shop-mini-price">{{ formatPrice(product.price) }}</span>
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
.shop-page {
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  overflow-x: hidden;
  --page-padding: max(24px, 3vw);
  --header-offset: 92px;
}

.shop-hero {
  position: relative;
  min-height: 88vh;
}

.shop-title {
  position: absolute;
  bottom: 24px;
  left: var(--page-padding);
  font-size: clamp(46px, 6.6vw, 90px);
  font-weight: 400;
  line-height: 1;
}

.shop-catalog {
  position: relative;
  padding: 0 var(--page-padding) 10vh;
}

.shop-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.shop-icon-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: opacity 180ms ease, transform 180ms ease;
}

.shop-icon-button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.shop-cart-badge {
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

.shop-no-results {
  margin: 40px 0 0;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.08em;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px 22px;
}

.shop-product {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0;
  text-align: left;
  overflow: hidden;
}

.shop-product-visual {
  position: relative;
  display: block;
  aspect-ratio: 1 / 1;
  width: 100%;
  overflow: hidden;
  background-color: #060606;
  padding: 8px;
}

.shop-product-image {
  position: absolute;
  inset: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  display: block;
  object-fit: contain;
  object-position: center center;
  transition: opacity 280ms ease;
}

.shop-product-image--secondary {
  opacity: 0;
}

.shop-product:hover .shop-product-image--primary,
.shop-product:focus-visible .shop-product-image--primary {
  opacity: 0;
}

.shop-product:hover .shop-product-image--secondary,
.shop-product:focus-visible .shop-product-image--secondary {
  opacity: 1;
}

.shop-product-meta {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 6px;
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0.05em;
  min-height: 16px;
  width: 100%;
  box-sizing: border-box;
  padding-inline: 8px;
}

.shop-product-name,
.shop-product-price {
  font-size: 12px;
  line-height: 1.1;
}

.shop-product-name {
  justify-self: start;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shop-product-price {
  justify-self: end;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.shop-search-backdrop,
.shop-drawer-backdrop,
.shop-modal-backdrop {
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
  gap: 12px;
}

.shop-mini-product {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  gap: 14px;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.shop-mini-image {
  width: 82px;
  aspect-ratio: 4 / 5;
  object-fit: contain;
  object-position: center center;
  background: #050505;
}

.shop-mini-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding: 2px 0;
  font-family: "Roboto Mono", monospace;
}

.shop-mini-name,
.shop-mini-price {
  font-size: 11px;
  letter-spacing: 0.08em;
}

.shop-mini-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.shop-cart-list {
  display: grid;
  gap: 12px;
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
  object-fit: contain;
  object-position: center center;
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

.shop-modal-backdrop {
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 0.78);
  padding: 18px;
}

.shop-product-modal {
  position: relative;
  width: min(980px, 100%);
  max-height: calc(100vh - var(--header-offset) - 36px);
  overflow: auto;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  background: #000;
  border: 1px solid rgb(255 255 255 / 0.14);
}

.shop-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: #fff;
  cursor: pointer;
  z-index: 1;
}

.shop-modal-media {
  min-height: 100%;
  background: #050505;
}

.shop-modal-image {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: contain;
  object-position: center center;
}

.shop-modal-copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 54px 30px 28px;
}

.shop-modal-kicker,
.shop-size-label {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.14em;
}

.shop-modal-title {
  margin: 0;
  font-size: clamp(28px, 3.6vw, 46px);
  font-weight: 400;
  line-height: 0.95;
}

.shop-modal-description {
  margin: 0;
  max-width: 34ch;
  color: rgb(255 255 255 / 0.76);
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: 0;
  text-transform: none;
}

.shop-size-group {
  display: grid;
  gap: 10px;
}

.shop-size-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.shop-size-button {
  min-width: 42px;
  border: 1px solid rgb(255 255 255 / 0.24);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  padding: 9px 10px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.shop-size-button.is-active,
.shop-size-button:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.shop-modal-footer {
  margin-top: auto;
  display: grid;
  gap: 14px;
}

.shop-modal-price {
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  letter-spacing: 0.08em;
}

.shop-add-button {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 0.55);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  padding: 13px 16px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.shop-add-button:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.shop-panel-enter-active,
.shop-panel-leave-active,
.shop-drawer-enter-active,
.shop-drawer-leave-active,
.shop-modal-enter-active,
.shop-modal-leave-active {
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

.shop-modal-enter-from,
.shop-modal-leave-to {
  opacity: 0;
}

.shop-modal-enter-from .shop-product-modal,
.shop-modal-leave-to .shop-product-modal {
  transform: translateY(14px) scale(0.98);
}

@media (min-width: 1025px) {
  .shop-hero {
    min-height: 92vh;
  }

  .shop-title {
    bottom: 24px;
  }
}

@media (max-width: 1024px) {
  .shop-hero {
    min-height: 86vh;
  }

  .shop-title {
    bottom: 32px;
    left: var(--page-padding);
    font-size: clamp(46px, 6.6vw, 90px);
  }

  .shop-catalog {
    padding-bottom: 8vh;
  }

  .shop-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 18px;
  }

  .shop-product-name,
  .shop-product-price {
    font-size: 11px;
  }

  .shop-product-meta {
    gap: 8px;
    padding-inline: 8px;
  }

  .shop-product:hover .shop-product-image--primary,
  .shop-product:focus-visible .shop-product-image--primary {
    opacity: 1;
  }

  .shop-search-panel {
    padding-top: 18px;
  }

  .shop-cart-drawer {
    width: min(100vw, 520px);
    padding: 16px 14px 18px;
  }

  .shop-product-modal {
    grid-template-columns: 1fr;
  }

  .shop-modal-copy {
    padding: 26px 18px 18px;
  }
}

@media (max-width: 760px) {
  .shop-hero {
    min-height: 88vh;
  }

  .shop-title {
    bottom: 36px;
    font-size: clamp(36px, 13vw, 58px);
  }

  .shop-catalog {
    padding-top: 0;
    padding-bottom: 9vh;
  }

  .shop-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px 12px;
  }

  .shop-product {
    gap: 6px;
  }

  .shop-product-visual {
    padding: 5px;
  }

  .shop-product-meta {
    gap: 5px;
    padding-inline: 4px;
  }

  .shop-product-name,
  .shop-product-price {
    font-size: 10px;
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

@media (min-width: 761px) and (max-width: 1024px) {
  .shop-hero {
    min-height: 90vh;
  }

  .shop-title {
    bottom: 36px;
    font-size: clamp(42px, 5.8vw, 76px);
  }

  .shop-catalog {
    padding-bottom: 7vh;
  }

  .shop-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px 16px;
  }

  .shop-product {
    gap: 8px;
  }

  .shop-product-visual {
    padding: 6px;
  }

  .shop-product-meta {
    gap: 6px;
    padding-inline: 6px;
  }

  .shop-product-name,
  .shop-product-price {
    font-size: 11px;
  }
}
</style>
