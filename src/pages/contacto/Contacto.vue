<script setup lang="ts">
import { ref } from "vue";

const name = ref("");
const email = ref("");
const subject = ref("");

const submitContact = () => {
  name.value = "";
  email.value = "";
  subject.value = "";
};
</script>

<template>
  <main class="contact-page">
    <section class="contact-hero">
      <h1 class="contact-title font-monument">CONTÁCTANOS</h1>
    </section>

    <section class="contact-form-section">
      <form class="contact-form" novalidate @submit.prevent="submitContact">
        <label class="contact-field">
          <input
            v-model="name"
            type="text"
            placeholder="NOMBRE Y APELLIDOS"
            aria-label="Nombre y apellidos"
          />
        </label>

        <label class="contact-field">
          <input
            v-model="email"
            type="text"
            placeholder="E-MAIL"
            aria-label="E-mail"
          />
        </label>

        <label class="contact-field">
          <input
            v-model="subject"
            type="text"
            placeholder="ASUNTO"
            aria-label="Asunto"
          />
        </label>

        <button class="contact-submit" type="submit">ENTER</button>
      </form>
    </section>
  </main>
</template>

<style scoped>
.contact-page {
  min-height: 100vh;
  background-color: black;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
}

.contact-hero {
  display: flex;
  min-height: 28vh;
  align-items: flex-end;
  padding: 0 0 5vh var(--page-padding);
}

.contact-title {
  width: 100%;
  margin: 0;
  font-size: clamp(30px, 3.8vw, 50px);
  font-weight: 400;
  line-height: 1;
}

.contact-form-section {
  min-height: 68vh;
  padding: 0 var(--page-padding) 0 var(--page-padding);
  background-color: black;
}

.contact-form {
  display: grid;
  gap: 28px;
  width: 100%;
  margin: 0;
  padding-top: 0;
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0;
}

.contact-field {
  display: block;
}

.contact-field input {
  width: 100%;
  border: 0;
  border-bottom: 0.5px solid rgb(255 255 255 / 72%);
  border-radius: 0;
  background-color: transparent;
  color: white;
  font: inherit;
  font-size: 17px;
  outline: none;
  padding: 0 0 8px;
  text-transform: uppercase;
}

.contact-field input::placeholder {
  color: white;
  opacity: 1;
}

.contact-submit {
  justify-self: end;
  margin-top: -20px;
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 17px;
  letter-spacing: 0;
  padding: 4px 0 0;
}

.contact-submit:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

@media (max-width: 760px) {
  .contact-hero {
    min-height: 24vh;
    padding-bottom: 4vh;
  }

  .contact-field span,
  .contact-field input,
  .contact-submit {
    font-size: 14px;
  }
}
</style>
