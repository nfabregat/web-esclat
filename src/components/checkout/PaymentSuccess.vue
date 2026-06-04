<script setup lang="ts">
import { Check } from "lucide-vue-next";
</script>

<template>
  <section class="checkout-success">
    <Check :size="72" stroke-width="1.6" />
    <h2 class="checkout-success-title">PAGO REALIZADO CON ÉXITO</h2>
    <p class="checkout-success-copy">¡GRACIAS POR SU COMPRA!</p>
  </section>
</template>

<style scoped>
.checkout-success {
  display: grid;
  justify-items: center;
  gap: 22px;
  color: #fff;
  padding: 0;
  text-align: center;
}

.checkout-success-title {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.14em;
  line-height: 1.15;
}

.checkout-success-copy {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
}
</style>
