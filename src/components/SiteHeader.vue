<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="site-header">
    <RouterLink class="site-logo font-monument" to="/">ESCLAT</RouterLink>
    <RouterLink class="site-menu font-monument" to="/menu">MENÚ</RouterLink>
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

.site-logo,
.site-menu {
  color: inherit;
  line-height: 1;
  text-decoration: none;
}

.site-logo {
  font-size: 28px;
  font-weight: 900;
}

.site-menu {
  font-size: 20px;
  font-weight: 400;
}
</style>
