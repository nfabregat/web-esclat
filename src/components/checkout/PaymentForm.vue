<script setup lang="ts">
import type { CheckoutValues } from "./types";

const props = defineProps<{
  form: CheckoutValues;
  isPaid: boolean;
}>();

const emit = defineEmits<{
  (event: "update-field", field: keyof CheckoutValues, value: string | boolean): void;
}>();

const updateText = (field: keyof CheckoutValues) => (event: Event) => {
  const value = (event.target as HTMLInputElement).value;

  emit("update-field", field, value);
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

const updateCardNumber = (event: Event) => {
  const value = formatCardNumber((event.target as HTMLInputElement).value);
  emit("update-field", "cardNumber", value);
};

const updateExpiry = (event: Event) => {
  const value = formatExpiry((event.target as HTMLInputElement).value);
  emit("update-field", "expiry", value);
};

const updateCvc = (event: Event) => {
  const value = formatCvc((event.target as HTMLInputElement).value);
  emit("update-field", "cvc", value);
};
</script>

<template>
  <section class="checkout-section">
    <h2 class="checkout-section-title font-monument">PAGO</h2>

    <div class="checkout-payment-grid">
      <label class="checkout-payment-full">
        <span class="sr-only">Nombre del titular</span>
        <input
          :value="props.form.holder"
          type="text"
          placeholder="NOMBRE DEL TITULAR"
          aria-label="Nombre del titular"
          @input="updateText('holder')"
        />
      </label>
      <label class="checkout-payment-full">
        <span class="sr-only">Número de tarjeta</span>
        <input
          :value="props.form.cardNumber"
          type="text"
          inputmode="numeric"
          maxlength="19"
          placeholder="NÚMERO DE TARJETA"
          aria-label="Número de tarjeta"
          @input="updateCardNumber"
        />
      </label>
      <div class="checkout-payment-row">
        <label class="checkout-payment-half">
          <span class="sr-only">Fecha de expiración</span>
          <input
            :value="props.form.expiry"
            type="text"
            inputmode="numeric"
            maxlength="5"
            placeholder="FECHA DE EXPIRACIÓN (MM / YY)"
            aria-label="Fecha de expiración"
            @input="updateExpiry"
          />
        </label>

        <label class="checkout-payment-half">
          <span class="sr-only">Código de seguridad</span>
          <input
            :value="props.form.cvc"
            type="text"
            inputmode="numeric"
            maxlength="3"
            placeholder="CÓDIGO DE SEGURIDAD"
            aria-label="Código de seguridad"
            @input="updateCvc"
          />
        </label>
      </div>
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

@media (min-width: 1025px) {
  .checkout-section {
    gap: 38px;
  }

  .checkout-section-title {
    font-size: 16px;
  }

  .checkout-payment-grid {
    gap: 20px;
  }

  .checkout-payment-full input,
  .checkout-payment-half input {
    height: 58px;
    font-size: 14px;
    padding-inline: 17px;
  }

  .checkout-payment-row {
    gap: 18px;
  }

  .checkout-error {
    font-size: 12px;
  }
}
</style>
