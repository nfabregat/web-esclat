<script setup lang="ts">
import type { CheckoutValues } from "./types";

defineProps<{
  form: CheckoutValues;
  isPaid: boolean;
}>();

const emit = defineEmits<{
  (event: "update-field", field: keyof CheckoutValues, value: string | boolean): void;
}>();

const updateText = (field: keyof CheckoutValues) => (event: Event) => {
  emit("update-field", field, (event.target as HTMLInputElement).value);
};

const digitsOnly = (value: string) => value.replace(/\D/g, "");

const formatCardNumber = (value: string) => {
  const digits = digitsOnly(value).slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

const formatExpiry = (value: string) => {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const formatCvc = (value: string) => digitsOnly(value).slice(0, 3);

const toggleRemember = (currentValue: boolean) => {
  console.log("CHECKBOX CLICK");
  emit("update-field", "rememberPayment", !currentValue);
};
</script>

<template>
  <section class="checkout-section">
    <h2 class="checkout-section-title font-monument">PAGO</h2>

    <div class="checkout-payment-grid">
      <label class="checkout-payment-full">
        <span class="sr-only">Nombre del titular</span>
        <input
          :value="form.holder"
          type="text"
          placeholder="NOMBRE DEL TITULAR"
          aria-label="Nombre del titular"
          @input="updateText('holder')"
        />
      </label>
      <label class="checkout-payment-full">
        <span class="sr-only">Número de tarjeta</span>
        <input
          :value="form.cardNumber"
          type="text"
          inputmode="numeric"
          maxlength="19"
          placeholder="NÚMERO DE TARJETA"
          aria-label="Número de tarjeta"
          @input="emit('update-field', 'cardNumber', formatCardNumber(($event.target as HTMLInputElement).value))"
        />
      </label>
      <div class="checkout-payment-row">
        <label class="checkout-payment-half">
          <span class="sr-only">Fecha de expiración</span>
          <input
            :value="form.expiry"
            type="text"
            inputmode="numeric"
            maxlength="5"
            placeholder="FECHA DE EXPIRACIÓN (MM / YY)"
            aria-label="Fecha de expiración"
            @input="emit('update-field', 'expiry', formatExpiry(($event.target as HTMLInputElement).value))"
          />
        </label>

        <label class="checkout-payment-half">
          <span class="sr-only">Código de seguridad</span>
          <input
            :value="form.cvc"
            type="text"
            inputmode="numeric"
            maxlength="3"
            placeholder="CÓDIGO DE SEGURIDAD"
            aria-label="Código de seguridad"
            @input="emit('update-field', 'cvc', formatCvc(($event.target as HTMLInputElement).value))"
          />
        </label>
      </div>
    </div>

    <div class="checkout-save">
      <button
        class="checkout-checkbox"
        type="button"
        :aria-pressed="form.rememberPayment"
        :disabled="isPaid"
        @click="toggleRemember(form.rememberPayment)"
      >
        <span v-if="form.rememberPayment" class="checkout-checkbox-mark">X</span>
      </button>
      <span class="checkout-save-text">GUARDAR INFORMACIÓN DE PAGO</span>
    </div>
  </section>
</template>

<style scoped>
.checkout-section {
  display: grid;
  gap: 32px;
}

.checkout-section-title {
  margin: 0;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.14em;
  line-height: 1;
}

.checkout-payment-grid {
  display: grid;
  gap: 16px;
}

.checkout-payment-full,
.checkout-payment-half {
  display: block;
}

.checkout-payment-full input,
.checkout-payment-half input {
  width: 100%;
  height: 50px;
  border: 1px solid #444;
  border-radius: 0;
  background: transparent;
  color: #fff;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  outline: none;
  padding: 0 14px;
  text-transform: uppercase;
  transition: border-color 180ms ease;
}

.checkout-payment-full input::placeholder,
.checkout-payment-half input::placeholder {
  color: #888;
  opacity: 1;
}

.checkout-payment-full input:focus,
.checkout-payment-half input:focus {
  border-color: #777;
}

.checkout-payment-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
}

.checkout-save {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-family: "Roboto Mono", monospace;
  font-size: 11px;
  letter-spacing: 0.08em;
}

.checkout-checkbox {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid #444;
  background: transparent;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;
}

.checkout-checkbox-mark {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 10px;
  line-height: 1;
}

.checkout-save-text {
  transform: translateY(1px);
}

.checkout-error {
  margin: -6px 0 0;
  color: rgb(255 255 255 / 0.72);
  font-family: "Roboto Mono", monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.checkout-error--row {
  margin-top: -2px;
}
</style>
