<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const toggleMenu = () => {
  if (route.name === "menu") {
    router.back();
    return;
  }

  router.push("/menu");
};
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-logo font-monument" to="/">ESCLAT</RouterLink>
    <button class="site-menu font-monument" type="button" @click="toggleMenu">
      MENÚ
    </button>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 28px max(24px, 3vw);
  background-color: transparent;
  color: white;
}

.site-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  width: 100%;
  height: 132px;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgb(0 0 0 / 0.94) 0%,
    rgb(0 0 0 / 0.78) 42%,
    rgb(0 0 0 / 0.34) 74%,
    rgb(0 0 0 / 0) 100%
  );
}

.site-logo,
.site-menu {
  position: relative;
  z-index: 1;
  color: inherit;
  line-height: 1;
  text-decoration: none;
}

.site-logo {
  font-size: 28px;
  font-weight: 900;
}

.site-menu {
  border: 0;
  background-color: transparent;
  cursor: pointer;
  font-size: 20px;
  font-weight: 400;
  padding: 0;
}

@media (max-width: 760px) {
  .site-header {
    padding: 22px 18px;
  }

  .site-header::before {
    height: 104px;
  }

  .site-logo {
    font-size: 23px;
  }

  .site-menu {
    font-size: 16px;
  }
}
</style>
