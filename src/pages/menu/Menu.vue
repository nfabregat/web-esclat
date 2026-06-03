<script setup lang="ts">
import { X } from "lucide-vue-next";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();

const menuLinks = [
  { text: "ENTRADAS", path: "/entradas" },
  { text: "ARTISTAS", path: "/artistas" },
  { text: "ACTIVIDADES", path: "/actividades" },
  { text: "PROGRAMA", path: "/programa" },
  { text: "TIENDA", path: "/tienda" },
  { text: "INFORMACIÓN", path: "/info" },
  { text: "CONTACTO", path: "/contacto" },
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
      <X class="back-icon" aria-hidden="true" />
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
  box-sizing: border-box;
  gap: 28px;
  width: min(100%, 980px);
  margin-left: auto;
  padding: clamp(118px, 22vh, 240px) clamp(24px, 4vw, 72px) 64px 24px;
  text-align: right;
}

.menu-link {
  color: inherit;
  max-width: 100%;
  font-size: clamp(30px, 4.4vw, 42px);
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  text-underline-offset: 8px;
}

.menu-link:hover {
  text-decoration: underline;
}

.back-button {
  position: fixed;
  right: 24px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  padding: 0;
}

.back-icon {
  width: 22px;
  height: 22px;
  stroke-width: 1.8;
}

@media (max-width: 760px) {
  .menu-nav {
    width: 100%;
    gap: 22px;
    padding: 18vh 18px 72px;
  }

  .menu-link {
    font-size: clamp(28px, 9vw, 34px);
    white-space: normal;
    text-underline-offset: 6px;
  }

  .back-button {
    right: 18px;
    bottom: 18px;
  }

  .back-icon {
    width: 18px;
    height: 18px;
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
