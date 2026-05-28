<script setup lang="ts">
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const menuLinks = [
  { text: "CONTACTO", path: "/contacto" },
  { text: "TIENDA", path: "/tienda" },
  { text: "ENTRADAS", path: "/entradas" },
  { text: "ARTISTAS", path: "/artistas" },
  { text: "PROGRAMA", path: "/programa" },
  { text: "INFO", path: "/info" },
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
      X
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
  gap: 28px;
  padding: 120px calc(max(24px, 3vw) + 140px) 64px 32vw;
  text-align: right;
}

.menu-link {
  color: inherit;
  font-size: 42px;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  text-underline-offset: 8px;
}

.menu-link:hover {
  text-decoration: underline;
}

.back-button {
  position: fixed;
  right: 24px;
  bottom: 18px;
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Monument Extended", sans-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 1;
}
</style>
