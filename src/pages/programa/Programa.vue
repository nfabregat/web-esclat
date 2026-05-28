<script setup lang="ts">
const programDays = ["23.10.26", "24.10.26", "25.10.26"];
const programFilters = ["EVENTOS", "ARTISTAS", "TALLERES"];

const collaboratorLogos = [
  { src: "/assets/logos/Ayuntament de Valencia.png", alt: "Ayuntament de Valencia" },
  { src: "/assets/logos/Las Naves.png", alt: "Las Naves" },
];

const organizerLogos = [
  { src: "/assets/logos/Diputacio de Valencia.png", alt: "Diputacio de Valencia" },
  { src: "/assets/logos/IVAJ.png", alt: "IVAJ" },
  { src: "/assets/logos/Turia.png", alt: "Turia" },
  { src: "/assets/logos/Cocacola.png", alt: "Cocacola" },
];
</script>

<template>
  <main class="program-page">
    <section class="program-hero">
      <h1 class="program-title font-monument">PROGRAMA</h1>
    </section>

    <section v-for="day in programDays" :key="day" class="program-day">
      <div class="program-filters">
        <button
          v-for="filter in programFilters"
          :key="filter"
          class="program-filter"
          type="button"
        >
          {{ filter }}
        </button>
      </div>

      <h2 class="program-date font-monument">{{ day }}</h2>
      <div class="program-empty-space"></div>
    </section>

    <footer class="program-footer">
      <div class="footer-columns">
        <section>
          <p class="footer-label">COLABORA</p>
          <div class="footer-logos">
            <span class="footer-esclat font-monument">ESCLAT</span>
            <img
              v-for="logo in collaboratorLogos"
              :key="logo.src"
              :src="logo.src"
              :alt="logo.alt"
            />
          </div>
        </section>

        <section>
          <p class="footer-label">ORGANIZA</p>
          <div class="footer-logos">
            <img
              v-for="logo in organizerLogos"
              :key="logo.src"
              :src="logo.src"
              :alt="logo.alt"
            />
          </div>
        </section>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <p class="footer-legal">
          © 2026 ESCLAT FESTIVAL | TÉRMINOS Y CONDICIONES · AVISO LEGAL ·
          POLÍTICA DE PRIVACIDAD · POLÍTICA DE COOKIES
        </p>

        <nav class="footer-socials" aria-label="Redes sociales">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17" cy="7" r="1"></circle>
            </svg>
          </a>
          <a href="#" aria-label="X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19"></path>
            </svg>
          </a>
          <a href="#" aria-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 6v10a3 3 0 1 1-3-3"></path>
              <path d="M10 6c2.5 3 4.5 4 7 4"></path>
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.program-page {
  min-height: 100vh;
  background-color: black;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
}

.program-hero {
  position: relative;
  min-height: 100vh;
}

.program-title {
  position: absolute;
  left: var(--page-padding);
  bottom: 32px;
  font-size: clamp(46px, 6.6vw, 90px);
  font-weight: 400;
  line-height: 1;
}

.program-day {
  padding: 12vh var(--page-padding) 0;
}

.program-filters {
  display: flex;
  gap: 32px;
  margin-bottom: 38px;
}

.program-filter {
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 18px;
  padding: 0;
  text-underline-offset: 5px;
}

.program-filter:hover {
  text-decoration: underline;
}

.program-date {
  margin: 0;
  font-size: clamp(34px, 3.8vw, 52px);
  font-weight: 400;
  line-height: 1;
}

.program-empty-space {
  min-height: 46vh;
}

.program-footer {
  background-color: black;
  padding: 10vh var(--page-padding) 26px;
}

.footer-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
}

.footer-label {
  margin: 0 0 22px;
  font-family: "Roboto Mono", monospace;
  color: white;
  font-size: 15px;
  line-height: 1;
}

.footer-logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

.footer-esclat {
  font-size: 18px;
  font-weight: 900;
  line-height: 1;
}

.footer-logos img {
  width: auto;
  max-height: 28px;
  filter: brightness(0) invert(1);
}

.footer-divider {
  height: 1px;
  margin: 44px 0 20px;
  background-color: rgb(255 255 255 / 18%);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.footer-legal {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  color: white;
  font-size: 10px;
  line-height: 1.5;
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-socials a {
  color: inherit;
}

.footer-socials svg {
  display: block;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: white;
  stroke-width: 1.7;
}

@media (max-width: 760px) {
  .program-filters {
    gap: 20px;
  }

  .footer-columns {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    display: grid;
  }
}
</style>
