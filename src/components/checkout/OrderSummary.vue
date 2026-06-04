<script setup lang="ts">
import type { CartItem } from "@/composables/useShopCart";
import type { ShopProduct } from "@/data/shop";

defineProps<{
  entries: Array<{
    item: CartItem;
    product: ShopProduct;
  }>;
  formatPrice: (value: number) => string;
}>();
</script>

<template>
  <section class="checkout-summary">
    <article v-for="entry in entries" :key="`${entry.item.productId}-${entry.item.size}`" class="checkout-summary-row">
      <img :src="entry.product.images[0]" :alt="entry.product.name" class="checkout-summary-image" />

      <div class="checkout-summary-copy">
        <p class="checkout-summary-name">{{ entry.product.name }}</p>
        <span class="checkout-summary-price">{{ formatPrice(entry.product.price) }}</span>
        <p class="checkout-summary-size">{{ entry.item.size }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.checkout-summary {
  display: grid;
  gap: 20px;
}

.checkout-summary-row {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.checkout-summary-image {
  width: 84px;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  background: #050505;
}

.checkout-summary-copy {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "name price"
    "size price";
  column-gap: 28px;
  row-gap: 2px;
  align-items: start;
}

.checkout-summary-name,
.checkout-summary-price,
.checkout-summary-size {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #fff;
  text-transform: uppercase;
}

.checkout-summary-name {
  grid-area: name;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-summary-price {
  grid-area: price;
  white-space: nowrap;
  flex-shrink: 0;
  justify-self: end;
}

.checkout-summary-size {
  grid-area: size;
  color: #fff;
}

@media (min-width: 1025px) {
  .checkout-summary {
    gap: 24px;
  }

  .checkout-summary-row {
    grid-template-columns: 98px minmax(0, 1fr);
    gap: 20px;
  }

  .checkout-summary-image {
    width: 98px;
  }

  .checkout-summary-copy {
    column-gap: 34px;
    row-gap: 4px;
  }

  .checkout-summary-name,
  .checkout-summary-price,
  .checkout-summary-size {
    font-size: 13px;
  }
}
</style>
