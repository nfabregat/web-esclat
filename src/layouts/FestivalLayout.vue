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

    <footer class="site-footer border-t border-white/10 bg-black px-6 py-10 text-white/80">
      <div class="mx-auto flex max-w-7xl flex-col gap-10">
        <div class="footer-brands grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p class="footer-label mb-4 uppercase tracking-[0.35em] text-white/50 text-[11px]">Colabora</p>
            <div class="brand-row flex flex-wrap items-center gap-8">
              <span class="brand-text text-xl font-black tracking-[0.3em]">ESCLAT</span>
              <img src="/assets/logos/Ayuntament de Valencia.png" alt="Ajuntament de València" class="h-10 max-w-[160px] object-contain" />
              <img src="/assets/logos/Las Naves.png" alt="Las Naves" class="h-10 max-w-[160px] object-contain" />
            </div>
          </div>

          <div>
            <p class="footer-label mb-4 uppercase tracking-[0.35em] text-white/50 text-[11px]">Organiza</p>
            <div class="brand-row flex flex-wrap items-center gap-8">
              <img src="/assets/logos/Diputacio de Valencia.png" alt="Diputació de València" class="h-10 max-w-[160px] object-contain" />
              <img src="/assets/logos/IVAJ.png" alt="IVAJ" class="h-10 max-w-[120px] object-contain" />
              <img src="/assets/logos/Turia.png" alt="Turia" class="h-10 max-w-[120px] object-contain" />
              <img src="/assets/logos/Cocacola.png" alt="Coca-Cola" class="h-10 max-w-[140px] object-contain" />
            </div>
          </div>
        </div>

        <div class="footer-meta flex flex-col gap-6 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p class="footer-copy uppercase tracking-[0.35em] text-white/60 text-[12px]">© 2026 Esclat Festival</p>

          <nav class="footer-links flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.3em] text-white/60">
            <RouterLink to="/" class="hover:text-white">Términos y condiciones</RouterLink>
            <RouterLink to="/" class="hover:text-white">Aviso legal</RouterLink>
            <RouterLink to="/" class="hover:text-white">Política de privacidad</RouterLink>
            <RouterLink to="/" class="hover:text-white">Política de cookies</RouterLink>
          </nav>

          <div class="footer-social flex items-center gap-4">
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" class="footer-social-link text-white/80 hover:text-white">
              <span class="sr-only">Instagram</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37a4 4 0 1 1-7.99.37 4 4 0 0 1 7.99-.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" class="footer-social-link text-white/80 hover:text-white">
              <span class="sr-only">X</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1s-4.26 1.84-6.48 3.1A4.48 4.48 0 0 0 12 5.1a4.48 4.48 0 0 0-4.14 2.77A12.8 12.8 0 0 1 1.64 2.16 4.48 4.48 0 0 0 3 9.71 4.42 4.42 0 0 1 .96 9.1v.05A4.48 4.48 0 0 0 4.46 13a4.45 4.45 0 0 1-2 .08 4.48 4.48 0 0 0 4.18 3.11A9 9 0 0 1 1 18.58a12.76 12.76 0 0 0 6.92 2.03c8.3 0 12.84-6.88 12.84-12.84 0-.2 0-.39-.02-.58A9.22 9.22 0 0 0 23 3z"/></svg>
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" class="footer-social-link text-white/80 hover:text-white">
              <span class="sr-only">TikTok</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18a4 4 0 0 1-4-4V6h4v8h3a4 4 0 0 0 4-4V3h4v7a8 8 0 0 1-8 8H9z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.footer-label {
  letter-spacing: 0.35em;
}
.brand-row img {
  filter: brightness(0) invert(1);
}
</style>
