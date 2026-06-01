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
  height: calc(100svh - 92px);
  min-height: 0;
  overflow: hidden;
  background-color: black;
  color: white;
}

.menu-nav {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 28px;
  padding: 22vh calc(max(24px, 3vw) + 140px) 64px 32vw;
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

@media (max-width: 760px) {
  .menu-nav {
    gap: 22px;
    padding: 20vh 18px 72px;
  }

  .menu-link {
    font-size: clamp(28px, 9vw, 34px);
    text-underline-offset: 6px;
  }

  .back-button {
    right: 18px;
    bottom: 18px;
    font-size: 18px;
  }
}

@media (max-width: 380px) {
  .menu-nav {
    gap: 18px;
  }

  .menu-link {
    font-size: clamp(25px, 8vw, 30px);
  }
}
</style>
