<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Minus, Plus, Search, ShoppingCart, X } from "lucide-vue-next";
import CheckoutForm from "@/components/checkout/CheckoutForm.vue";
import OrderSummary from "@/components/checkout/OrderSummary.vue";
import PaymentSuccess from "@/components/checkout/PaymentSuccess.vue";
import { type CheckoutValues } from "@/components/checkout/types";
import { formatShopPrice, shopProducts, type ShopProduct } from "@/data/shop";
import { useShopCart, type CartItem } from "@/composables/useShopCart";

const route = useRoute();
const router = useRouter();
const { cartItems, cartCount, cartTotal, incrementItem, decrementItem, getCartLineTotal, getCartProduct } =
  useShopCart();
const formatPrice = formatShopPrice;

const searchQuery = ref("");
const searchInputRef = ref<HTMLInputElement | null>(null);
const isSearchOpen = ref(false);
const isCartOpen = ref(false);
const paymentSuccess = ref(false);
const isPaid = paymentSuccess;
const successRef = ref<HTMLDivElement | null>(null);
const paymentMessage = ref("");
const form = ref<CheckoutValues>({
  email: "",
  name: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  province: "",
  holder: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  rememberPayment: false,
});

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

const updateField = (field: keyof CheckoutValues, value: string | boolean) => {
  Object.assign(form.value, { [field]: value });
};

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

const goBackToCart = () => {
  closeSearch();
  closeCart();
  router.push({ name: "tienda", query: { cart: "open" } });
};

const goToCheckout = () => {
  closeCart();

  if (route.name !== "checkout") {
    router.push({ name: "checkout" });
  }
};

const goToShop = () => {
  router.push({ name: "tienda" });
};

const submitCheckout = async () => {
  paymentMessage.value = "";
  paymentSuccess.value = true;

  await nextTick();
  successRef.value?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key !== "Escape") return;

  closeSearch();
  closeCart();
};

watch(
  [isSearchOpen, isCartOpen, paymentSuccess],
  async ([searchOpen, cartOpen, paid]) => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = Boolean(searchOpen || cartOpen || paid) ? "hidden" : "";

    if (searchOpen) {
      await nextTick();
      searchInputRef.value?.focus();
    }
  },
  { immediate: true },
);

watch(
  () => route.name,
  (routeName) => {
    if (routeName !== "checkout") {
      closeSearch();
      closeCart();
    }
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);

  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <main class="checkout-page">
    <section class="checkout-shell">
      <div class="checkout-toolbar">
        <button class="checkout-icon-button checkout-icon-button--back" type="button" aria-label="Volver al carrito" @click="goBackToCart">
          <ArrowLeft :size="22" />
        </button>

        <div class="checkout-toolbar-actions">
          <button
            class="checkout-icon-button"
            type="button"
            aria-label="Abrir buscador"
            @click.stop="toggleSearch"
          >
            <Search :size="22" />
          </button>

          <button
            class="checkout-icon-button"
            type="button"
            aria-label="Abrir carrito"
            @click.stop="toggleCart"
          >
            <ShoppingCart :size="22" />
            <span v-if="cartCount > 0" class="checkout-cart-badge">{{ cartCount }}</span>
          </button>
        </div>
      </div>

      <section class="checkout-summary-wrap">
        <OrderSummary v-if="cartEntries.length" :entries="cartEntries" :format-price="formatPrice" />

        <section v-if="cartEntries.length" class="checkout-total" aria-label="Total del pedido">
          <span class="checkout-total-label">TOTAL</span>
          <strong class="checkout-total-value">{{ formatPrice(cartTotal) }}</strong>
        </section>
      </section>

      <div class="checkout-divider"></div>

      <CheckoutForm :form="form" :is-paid="isPaid" @update-field="updateField" @submit="submitCheckout" />

      <p v-if="paymentMessage" class="checkout-notice">{{ paymentMessage }}</p>

      <div v-if="isPaid" ref="successRef" class="checkout-success-anchor">
        <PaymentSuccess />

        <button class="checkout-submit checkout-submit--success" type="button" @click="goToShop">
          HACER OTRO PEDIDO
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

            <button class="shop-pay-button" type="button" @click="goToCheckout">
              COMPRAR
            </button>
          </div>
        </aside>
      </div>
    </transition>
  </main>
</template>

<style scoped>
.checkout-page {
  min-height: 100vh;
  background: #000;
  color: #fff;
  --page-padding: max(24px, 3vw);
  --header-offset: 92px;
  --checkout-content-width: min(100%, 620px);
}

.checkout-shell {
  display: grid;
  gap: 0;
  padding: 8vh var(--page-padding) 14vh;
}

.checkout-toolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: var(--checkout-content-width);
  min-height: 28px;
  margin-bottom: 40px;
}

.checkout-toolbar-actions {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.checkout-icon-button {
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

.checkout-icon-button:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.checkout-cart-badge {
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

.checkout-summary-wrap {
  display: grid;
  width: var(--checkout-content-width);
  gap: 22px;
}

.checkout-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 0 0;
  border-top: 1px solid #333;
}

.checkout-total-label,
.checkout-total-value {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.checkout-total-label {
  font-size: 12px;
  color: rgb(255 255 255 / 0.72);
}

.checkout-total-value {
  font-size: clamp(16px, 1.6vw, 20px);
  font-weight: 400;
  color: #fff;
  font-variant-numeric: tabular-nums;
}

.checkout-divider {
  margin: 50px 0 40px;
  border-top: 1px solid #333;
}

.checkout-form {
  width: var(--checkout-content-width);
}

.checkout-success-anchor {
  margin-top: 150px;
  display: grid;
  justify-items: center;
  gap: 28px;
  width: var(--checkout-content-width);
}

.checkout-submit--success {
  width: 100%;
  font-family: "Roboto Mono", monospace;
  border: 1px solid rgb(255 255 255 / 0.48);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0.18em;
  padding: 14px 18px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
  margin-top: clamp(180px, 24vh, 280px);
}

.checkout-submit--success:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.checkout-notice {
  margin: 16px 0 0;
  width: var(--checkout-content-width);
  color: rgb(255 255 255 / 0.72);
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (min-width: 1025px) {
  .checkout-page {
    --checkout-content-width: min(100%, 720px);
  }

  .checkout-toolbar {
    margin-bottom: 46px;
  }

  .checkout-summary-wrap {
    gap: 26px;
  }

  .checkout-total {
    gap: 18px;
    padding-top: 22px;
  }

  .checkout-total-label {
    font-size: 14px;
  }

  .checkout-total-value {
    font-size: clamp(19px, 1.8vw, 24px);
  }

  .checkout-divider {
    margin: 58px 0 48px;
  }

  .checkout-submit--success {
    font-size: 14px;
    padding: 16px 22px;
  }

  .checkout-notice {
    font-size: 12px;
  }
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
  width: 64px;
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

@media (max-width: 760px) {
  .checkout-page {
    --checkout-content-width: min(100%, 620px);
  }

  .checkout-shell {
    padding-top: 4vh;
    padding-bottom: 10vh;
  }

  .checkout-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .checkout-toolbar-actions {
    position: static;
    left: auto;
    transform: none;
    margin-left: auto;
  }
}

@media (min-width: 761px) and (max-width: 1024px) {
  .checkout-page {
    --checkout-content-width: min(100%, 620px);
  }

  .checkout-shell {
    padding-top: 0;
    padding-bottom: 12vh;
    margin-top: -20vh;
  }

  .checkout-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .checkout-toolbar-actions {
    position: static;
    left: auto;
    transform: none;
    margin-left: auto;
  }
}
</style>
