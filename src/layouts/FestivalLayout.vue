<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import SiteHeader from '@/components/SiteHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <SiteHeader />
    <main class="pt-[92px]">
      <RouterView />
    </main>

    <footer class="site-footer border-t border-white/10 bg-black px-6 py-8 text-white/80">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p class="text-sm">Esclat Festival · 2026 · Todos los derechos reservados</p>
        <nav class="flex flex-wrap gap-4 text-sm">
          <RouterLink to="/" class="hover:text-white">Inicio</RouterLink>
          <RouterLink to="/artistas" class="hover:text-white">Artistas</RouterLink>
          <RouterLink to="/programa" class="hover:text-white">Programa</RouterLink>
          <RouterLink to="/info" class="hover:text-white">Info</RouterLink>
        </nav>
      </div>
    </footer>
  </div>
</template>

<style scoped>
</style>
