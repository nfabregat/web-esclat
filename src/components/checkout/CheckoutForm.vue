<script setup lang="ts">
import type { CheckoutValues } from "./types";
import PaymentForm from "./PaymentForm.vue";

defineProps<{
  form: CheckoutValues;
  isPaid: boolean;
}>();

const emit = defineEmits<{
  (event: "update-field", field: keyof CheckoutValues, value: string | boolean): void;
  (event: "submit"): void;
}>();

const updateText = (field: keyof CheckoutValues) => (event: Event) => {
  emit("update-field", field, (event.target as HTMLInputElement).value);
};

const updateField = (field: keyof CheckoutValues, value: string | boolean) => {
  emit("update-field", field, value);
};

const handleSubmit = () => {
  console.log("FORM SUBMIT");
  emit("submit");
};
</script>

<template>
  <form class="checkout-form" novalidate @submit.prevent="handleSubmit">
    <section class="checkout-section">
      <h2 class="checkout-section-title font-monument">CONTACTO</h2>

      <div class="checkout-field-group">
        <label class="checkout-field">
          <input
            :value="form.email"
            type="text"
            placeholder="EMAIL"
            aria-label="Email"
            @input="updateText('email')"
          />
        </label>
      </div>
    </section>

    <section class="checkout-section">
      <h2 class="checkout-section-title font-monument">PEDIDO</h2>

      <div class="checkout-field-grid">
        <label class="checkout-field">
          <input
            :value="form.name"
            type="text"
            placeholder="NOMBRE"
            aria-label="Nombre"
            @input="updateText('name')"
          />
        </label>

        <label class="checkout-field">
          <input
            :value="form.phone"
            type="text"
            placeholder="TELÉFONO"
            aria-label="Teléfono"
            @input="updateText('phone')"
          />
        </label>
      </div>

      <div class="checkout-field-group">
        <label class="checkout-field">
          <input
            :value="form.address"
            type="text"
            placeholder="DIRECCIÓN"
            aria-label="Dirección"
            @input="updateText('address')"
          />
        </label>
      </div>

      <div class="checkout-field-grid checkout-field-grid--three">
        <label class="checkout-field">
          <input
            :value="form.postalCode"
            type="text"
            placeholder="CP"
            aria-label="Código postal"
            @input="updateText('postalCode')"
          />
        </label>

        <label class="checkout-field">
          <input
            :value="form.city"
            type="text"
            placeholder="CIUDAD"
            aria-label="Ciudad"
            @input="updateText('city')"
          />
        </label>

        <label class="checkout-field">
          <input
            :value="form.province"
            type="text"
            placeholder="PROVINCIA"
            aria-label="Provincia"
            @input="updateText('province')"
          />
        </label>
      </div>
    </section>

    <PaymentForm :form="form" :is-paid="isPaid" @update-field="updateField" />

    <button class="checkout-submit font-monument" type="submit" :disabled="isPaid">
      {{ isPaid ? "PAGO COMPLETADO" : "PAGAR AHORA" }}
    </button>
  </form>
</template>

<style scoped>
.checkout-form {
  display: grid;
  gap: 72px;
}

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

.checkout-field-group {
  display: grid;
  gap: 10px;
}

.checkout-field-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 18px;
}

.checkout-field-grid--three {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
}

.checkout-field {
  display: block;
}

.checkout-field input {
  width: 100%;
  border: 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.72);
  border-radius: 0;
  background: transparent;
  color: #fff;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  outline: none;
  padding: 0 0 10px;
  text-transform: uppercase;
  transition: border-color 180ms ease;
}

.checkout-field input::placeholder {
  color: rgb(255 255 255 / 0.56);
  opacity: 1;
}

.checkout-field input:focus {
  border-bottom-color: #fff;
}

.checkout-submit {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 0.48);
  background: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  letter-spacing: 0.18em;
  padding: 14px 18px;
  transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease;
}

.checkout-submit:hover:not(:disabled) {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.checkout-submit:disabled {
  cursor: default;
  opacity: 0.9;
}

@media (min-width: 1025px) {
  .checkout-form {
    gap: 84px;
  }

  .checkout-section {
    gap: 38px;
  }

  .checkout-section-title {
    font-size: 16px;
  }

  .checkout-field-group {
    gap: 12px;
  }

  .checkout-field-grid {
    gap: 22px;
  }

  .checkout-field input {
    font-size: 14px;
    padding-bottom: 13px;
  }

  .checkout-submit {
    font-size: 14px;
    padding: 17px 22px;
  }
}
</style>
