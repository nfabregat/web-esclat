<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const menuLinks = [
  { text: "Info", path: "/info" },
  { text: "Programa", path: "/programa" },
  { text: "Artistas", path: "/artistas" },
  { text: "Tienda", path: "/tienda" },
  { text: "Contacto", path: "/contacto" },
];

const goBack = () => {
  router.back();
};
</script>

<template>
  <section class="menu-page">
    <nav class="menu-nav" aria-label="Menu principal">
      <RouterLink
        v-for="link in menuLinks"
        :key="link.path"
        class="menu-link font-monument"
        :to="link.path"
      >
        {{ link.text }}
      </RouterLink>
    </nav>

    <button class="back-button" type="button" aria-label="Volver" @click="goBack">
      ←
    </button>
  </section>
</template>

<style scoped>
.menu-page {
  position: relative;
  min-height: 100vh;
  background-color: black;
  color: white;
}

.menu-nav {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  padding: 120px 32px 64px;
}

.menu-link {
  color: inherit;
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
}

.back-button {
  position: fixed;
  right: 32px;
  bottom: 32px;
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 42px;
  line-height: 1;
}
</style>
