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

    <footer v-if="showFooter" class="site-footer mt-0 bg-black pb-8 pt-12 text-white/80 md:pt-16">
      <div class="footer-inner flex flex-col gap-8">
        <div class="footer-top flex flex-col gap-8">
          <div class="footer-brands grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p class="footer-label mb-3 uppercase text-white/50">Organiza</p>
              <div class="brand-row flex flex-wrap items-center gap-6">
                <RouterLink to="/" class="brand-text font-monument text-[17px] font-black tracking-normal">ESCLAT</RouterLink>
                <div class="collab-logos flex items-center">
                  <a href="https://www.valencia.es/val/inici" target="_blank" rel="noreferrer">
                    <img src="/assets/logos/Ayuntament de Valencia.png" alt="Ajuntament de València" class="h-8 max-w-[132px] object-contain" />
                  </a>
                  <a href="https://cultural.valencia.es/espais/las-naves-centre-dinnovacio/" target="_blank" rel="noreferrer">
                    <img src="/assets/logos/Las Naves.png" alt="Las Naves" class="h-8 max-w-[132px] object-contain" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p class="footer-label mb-3 uppercase text-white/50">Colabora</p>
              <div class="brand-row flex flex-wrap items-center gap-6">
                <a href="http://dival.es/va" target="_blank" rel="noreferrer">
                  <img src="/assets/logos/Diputacio de Valencia.png" alt="Diputació de València" class="footer-logo-diputacio h-8 max-w-[132px] object-contain" />
                </a>
                <a href="https://ivaj.gva.es/va/" target="_blank" rel="noreferrer">
                  <img src="/assets/logos/IVAJ.png" alt="IVAJ" class="footer-logo-ivaj h-8 max-w-[96px] object-contain" />
                </a>
                <a href="https://www.cervezaturia.es/va" target="_blank" rel="noreferrer">
                  <img src="/assets/logos/Turia.png" alt="Turia" class="h-8 max-w-[96px] object-contain" />
                </a>
                <a href="https://www.coca-cola.com/es/es" target="_blank" rel="noreferrer">
                  <img src="/assets/logos/Cocacola.png" alt="Coca-Cola" class="footer-logo-cocacola h-8 max-w-[112px] object-contain" />
                </a>
              </div>
            </div>
          </div>

          <div class="footer-social footer-social--brands flex items-center justify-end gap-4 lg:hidden">
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

        <div class="footer-meta flex flex-col gap-5 border-t border-white/10 pt-5 text-sm md:flex-row md:items-center md:justify-between">
          <p class="footer-copy uppercase text-white/60">
            <RouterLink to="/">© 2026 Esclat Festival</RouterLink>
          </p>

          <nav class="footer-links flex flex-wrap items-center gap-4 uppercase text-white/60">
            <RouterLink to="/" class="hover:text-white">Términos y condiciones</RouterLink>
            <RouterLink to="/" class="hover:text-white">Aviso legal</RouterLink>
            <RouterLink to="/" class="hover:text-white">Política de privacidad</RouterLink>
            <RouterLink to="/" class="hover:text-white">Política de cookies</RouterLink>
          </nav>

          <div class="footer-social footer-social--meta hidden items-center gap-4 lg:flex">
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
.site-footer {
  --footer-padding: clamp(18px, 3vw, 48px);
  --footer-logo-scale: 1;
}

.footer-inner {
  width: 100%;
  padding-inline: var(--footer-padding);
}

.footer-top {
  width: 100%;
}

.footer-label {
  font-size: 10px;
  letter-spacing: 0.25em;
}
.brand-row img {
  filter: brightness(0) invert(1);
  transform: scale(var(--footer-logo-scale));
  transform-origin: left center;
}

.brand-row .footer-logo-diputacio {
  height: 26px;
  max-width: 118px;
}

.brand-text {
  color: white;
}

.brand-row .footer-logo-ivaj {
  height: 32px;
  max-width: 100px;
  transform: translateY(3px);
}

.brand-row .footer-logo-cocacola {
  height: 30px;
  max-width: 104px;
}

.brand-row a,
.footer-copy a {
  color: inherit;
  text-decoration: none;
}
.brand-row a {
  display: inline-flex;
}

.collab-logos {
  gap: 0;
}

.collab-logos a + a {
  margin-left: -5px;
}
.footer-copy {
  font-size: 10px;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.55);
}
.footer-links {
  gap: 12px;
}
.footer-links a {
  font-size: 10px;
  letter-spacing: 0.25em;
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
  width: 22px;
  height: 22px;
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
  width: 22px;
  height: 22px;
  padding: 0;
  transition: transform 160ms ease, opacity 120ms ease;
}

.footer-social-link:hover .social-svg {
  transform: scale(1.06);
  opacity: 1;
}

.social-svg {
  width: 22px;
  height: 22px;
  color: white;
  opacity: 0.95;
  transition: transform 160ms ease, opacity 120ms ease;
}

@media (max-width: 640px) {
  .site-footer {
    --footer-padding: 12px;
    --footer-logo-scale: 0.82;
  }

  .footer-inner {
    gap: 20px;
  }

  .footer-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 14px;
  }

  .footer-brands {
    gap: 14px;
  }

  .footer-label {
    margin-bottom: 10px;
  }

  .brand-row {
    gap: 14px;
  }

  .collab-logos {
    gap: 0;
  }

  .collab-logos a + a {
    margin-left: -6px;
  }

  .brand-row .footer-logo-diputacio {
    height: 22px;
    max-width: 104px;
  }

  .brand-row .footer-logo-ivaj {
    height: 26px;
    max-width: 82px;
    transform: translateY(2px) scale(var(--footer-logo-scale));
  }

  .brand-row .footer-logo-cocacola {
    height: 24px;
    max-width: 86px;
  }

  .footer-meta {
    gap: 16px;
    padding-top: 16px;
  }

  .footer-social {
    gap: 10px;
  }

  .footer-social-link,
  .social-svg,
  .lucide-icon {
    width: 18px;
    height: 18px;
  }

  .footer-social--brands {
    justify-self: end;
    margin-top: 0;
    padding-top: 24px;
    align-self: end;
  }

  .footer-links {
    gap: 4px 10px;
    flex-wrap: wrap;
    align-items: center;
  }

  .footer-links a {
    font-size: 8px;
    line-height: 1.25;
    letter-spacing: 0.16em;
    white-space: nowrap;
  }
  .footer-copy {
    font-size: 9px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .footer-top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 28px;
  }

  .footer-social--brands {
    justify-self: end;
    margin-top: 0;
    padding-top: 44px;
    align-self: end;
  }

  .footer-links a {
    font-size: 8px;
    letter-spacing: 0.14em;
    white-space: nowrap;
  }

  .footer-links {
    flex: 1 1 auto;
    min-width: 0;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 4px 8px;
  }
}

@media (min-width: 1024px) {
  .footer-brands {
    grid-template-columns: max-content max-content;
    justify-content: start;
    column-gap: 150px;
  }
}
</style>
