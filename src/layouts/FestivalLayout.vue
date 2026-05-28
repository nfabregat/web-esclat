<script setup lang="ts">
import { RouterView } from 'vue-router';
import SiteHeader from '@/components/SiteHeader.vue';
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <SiteHeader />
    <main class="pt-[92px]">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
</style>
