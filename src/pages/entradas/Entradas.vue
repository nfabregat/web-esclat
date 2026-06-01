<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const isSent = ref(false);

const sendEmail = () => {
  if (!email.value) return;

  email.value = "";
  isSent.value = true;
};
</script>

<template>
  <section class="tickets-page">
    <div class="tickets-content">
      <h1 class="tickets-title font-monument">
        <span>CONSIGUE TU</span>
        <span>ENTRADA</span>
      </h1>

      <form class="tickets-form" @submit.prevent="sendEmail">
        <input
          v-model="email"
          class="tickets-input"
          type="email"
          :placeholder="isSent ? 'EMAIL ENVIADO CORRECTAMENTE' : 'INTRODUCE TU E-MAIL'"
          aria-label="Introduce tu e-mail"
        />
        <button class="tickets-button" type="submit">ENTER</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.tickets-page {
  min-height: 100vh;
  background-color: black;
  color: white;
  --page-padding: max(24px, 3vw);
}

.tickets-content {
  width: auto;
  padding: 16vh var(--page-padding) 0;
}

.tickets-title {
  display: flex;
  gap: 0.32em;
  max-width: none;
  margin: 0 0 34px;
  font-size: clamp(30px, 3.8vw, 42px);
  font-weight: 400;
  line-height: 1.16;
}

.tickets-form {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  border: 0.5px solid rgb(255 255 255 / 55%);
}

.tickets-input {
  min-width: 0;
  border: 0;
  background-color: transparent;
  color: white;
  font: inherit;
  font-size: 16px;
  padding: 14px 20px;
  outline: none;
}

.tickets-input::placeholder {
  color: white;
  opacity: 1;
}

.tickets-button {
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0;
  padding: 14px 24px;
}

@media (max-width: 760px) {
  .tickets-content {
    padding-top: 15vh;
  }

  .tickets-title {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 13ch;
    margin-bottom: 28px;
    font-size: clamp(27px, 8vw, 34px);
    line-height: 1.3;
  }

  .tickets-input {
    font-size: 14px;
    padding: 13px 14px;
  }

  .tickets-button {
    font-size: 14px;
    padding: 13px 14px;
  }
}

@media (max-width: 380px) {
  .tickets-page {
    --page-padding: 18px;
  }

  .tickets-content {
    padding-top: 14vh;
  }

  .tickets-title {
    font-size: clamp(24px, 7.4vw, 29px);
  }

  .tickets-input,
  .tickets-button {
    font-size: 13px;
  }
}
</style>
