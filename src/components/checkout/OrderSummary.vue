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
        <div class="checkout-summary-line">
          <p class="checkout-summary-name">{{ entry.product.name }}</p>
          <span class="checkout-summary-price">{{ formatPrice(entry.product.price) }}</span>
        </div>

        <p class="checkout-summary-size">{{ entry.item.size }}</p>
      </div>
    </article>
  </section>
</template>

<style scoped>
.checkout-summary {
  display: grid;
  gap: 14px;
}

.checkout-summary-row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.checkout-summary-image {
  width: 72px;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: #050505;
}

.checkout-summary-copy {
  min-width: 0;
  display: grid;
  gap: 6px;
}

.checkout-summary-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
}

.checkout-summary-name,
.checkout-summary-price,
.checkout-summary-size {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.checkout-summary-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.checkout-summary-price {
  white-space: nowrap;
  flex-shrink: 0;
}

.checkout-summary-size {
  color: rgb(255 255 255 / 0.72);
}
</style>
