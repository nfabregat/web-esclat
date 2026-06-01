<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import SiteHeader from '@/components/SiteHeader.vue';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-vue-next';

const route = useRoute();
const showFooter = computed(() => route.name !== 'menu');
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <SiteHeader />
    <main class="pt-[92px]">
      <RouterView />
    </main>

    <footer v-if="showFooter" class="site-footer border-t border-white/10 bg-black px-6 py-10 text-white/80">
      <div class="mx-auto flex max-w-7xl flex-col gap-10">
        <div class="footer-brands grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p class="footer-label mb-4 uppercase tracking-[0.35em] text-white/50 text-[11px]">Colabora</p>
            <div class="brand-row flex flex-wrap items-center gap-8">
              <RouterLink to="/" class="brand-text text-xl font-black tracking-[0.3em]">ESCLAT</RouterLink>
              <a href="https://www.valencia.es/val/inici" target="_blank" rel="noreferrer">
                <img src="/assets/logos/Ayuntament de Valencia.png" alt="Ajuntament de València" class="h-10 max-w-[160px] object-contain" />
              </a>
              <a href="https://cultural.valencia.es/espais/las-naves-centre-dinnovacio/" target="_blank" rel="noreferrer">
                <img src="/assets/logos/Las Naves.png" alt="Las Naves" class="h-10 max-w-[160px] object-contain" />
              </a>
            </div>
          </div>

          <div>
            <p class="footer-label mb-4 uppercase tracking-[0.35em] text-white/50 text-[11px]">Organiza</p>
            <div class="brand-row flex flex-wrap items-center gap-8">
              <a href="http://dival.es/va" target="_blank" rel="noreferrer">
                <img src="/assets/logos/Diputacio de Valencia.png" alt="Diputació de València" class="h-10 max-w-[160px] object-contain" />
              </a>
              <a href="https://ivaj.gva.es/va/" target="_blank" rel="noreferrer">
                <img src="/assets/logos/IVAJ.png" alt="IVAJ" class="h-10 max-w-[120px] object-contain" />
              </a>
              <a href="https://www.cervezaturia.es/va" target="_blank" rel="noreferrer">
                <img src="/assets/logos/Turia.png" alt="Turia" class="h-10 max-w-[120px] object-contain" />
              </a>
              <a href="https://www.coca-cola.com/es/es" target="_blank" rel="noreferrer">
                <img src="/assets/logos/Cocacola.png" alt="Coca-Cola" class="h-10 max-w-[140px] object-contain" />
              </a>
            </div>
          </div>
        </div>

        <div class="footer-meta flex flex-col gap-6 border-t border-white/10 pt-6 text-sm md:flex-row md:items-center md:justify-between">
          <p class="footer-copy uppercase tracking-[0.35em] text-white/60 text-[12px]">
            <RouterLink to="/">© 2026 Esclat Festival</RouterLink>
          </p>

          <nav class="footer-links flex flex-wrap items-center gap-4 text-[12px] uppercase tracking-[0.3em] text-white/60">
            <RouterLink to="/" class="hover:text-white">Términos y condiciones</RouterLink>
            <RouterLink to="/" class="hover:text-white">Aviso legal</RouterLink>
            <RouterLink to="/" class="hover:text-white">Política de privacidad</RouterLink>
            <RouterLink to="/" class="hover:text-white">Política de cookies</RouterLink>
          </nav>

          <div class="footer-social flex items-center gap-4">
            <Button as="a" href="https://www.instagram.com" target="_blank" rel="noreferrer" variant="ghost" size="icon" class="footer-social-link no-hover">
              <component :is="Icons.Instagram" class="lucide-icon" />
              <span class="sr-only">Instagram</span>
            </Button>

            <a href="https://x.com" target="_blank" rel="noreferrer" class="footer-social-link" aria-label="X">
              <svg viewBox="0 0 24 24" fill="currentColor" class="social-svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.514l-5.106-6.665-5.841 6.665H2.556l7.73-8.835L1.75 2.25h6.52l4.827 6.383 5.447-6.383zM16.6 20.575h1.829L7.75 3.972H5.81l10.79 16.603z"/>
              </svg>
            </a>

            <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" class="footer-social-link" aria-label="TikTok">
              <svg viewBox="0 0 16 16" fill="currentColor" class="social-svg">
                <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
              </svg>
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
.brand-row a,
.footer-copy a {
  color: inherit;
  text-decoration: none;
}
.brand-row a {
  display: inline-flex;
}
.footer-copy {
  font-size: 11px;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.55);
}
.footer-links {
  gap: 12px;
}
.footer-links a {
  font-size: 11px;
  opacity: 0.6;
}
.footer-links a:hover {
  opacity: 1;
}

.no-hover {
  background-color: transparent !important;
}
.no-hover:hover {
  background-color: transparent !important;
}
.lucide-icon {
  width: 28px;
  height: 28px;
  color: white;
  opacity: 0.95;
  transition: transform 160ms ease, opacity 120ms ease;
}
.no-hover:hover .lucide-icon {
  transform: scale(1.06);
  opacity: 1;
}

.footer-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 160ms ease, opacity 120ms ease;
}

.footer-social-link:hover .social-svg {
  transform: scale(1.06);
  opacity: 1;
}

.social-svg {
  width: 28px;
  height: 28px;
  color: white;
  opacity: 0.95;
  transition: transform 160ms ease, opacity 120ms ease;
}

@media (max-width: 640px) {
  .footer-links {
    display: none;
  }
  .footer-copy {
    font-size: 10px;
  }
}
</style>
