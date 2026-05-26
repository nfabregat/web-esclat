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
      <h1 class="tickets-title font-monument">CONSIGUE TU ENTRADA</h1>

      <form class="tickets-form" @submit.prevent="sendEmail">
        <input
          v-model="email"
          class="tickets-input"
          type="email"
          :placeholder="isSent ? 'EMAIL ENVIADO CORRECTAMENTE' : 'INTRODUCE TU E-MAIL'"
          aria-label="Introduce tu e-mail"
        />
        <button class="tickets-button font-monument" type="submit">ENTER</button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.tickets-page {
  min-height: 100vh;
  background-color: black;
  color: white;
}

.tickets-content {
  width: calc(100% - 128px);
  padding-top: 36vh;
  margin-inline: 64px;
}

.tickets-title {
  margin-bottom: 28px;
  font-size: 42px;
  font-weight: 400;
  line-height: 1.05;
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
  font-size: 16px;
  font-weight: 400;
  padding: 14px 24px;
}
</style>
