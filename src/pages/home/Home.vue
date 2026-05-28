<script lang="ts" setup>
import { RouterLink } from "vue-router";

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
  <main class="home">
    <section class="home-hero">
      <div class="home-hero-image"></div>

      <div class="home-meta font-monument">
        <p class="home-date">
          23.10—<br />
          25.10.26
        </p>

        <p class="home-location">
          LAS NAVES<br />
          VALENCIA
        </p>
      </div>
    </section>

    <section class="home-intro">
      <div class="home-intro-content">
        <h2 class="home-intro-title font-monument">
          <span>FESTIVAL DE MÚSICA,</span>
          <span>PENSAMIENTO Y</span>
          <span>CREATIVIDAD</span>
        </h2>

        <RouterLink class="home-info-link font-monument" to="/info">
          MÁS INFORMACIÓN
        </RouterLink>
      </div>
    </section>

    <footer class="home-footer">
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
.home {
  min-height: 100vh;
  background-color: #0a0a0a;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
}

.home-hero {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: flex-end;
  padding: 14vh var(--page-padding) 4vh;
}

.home-hero-image {
  width: 100%;
  height: 56vh;
  background-color: black;
}

.home-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 28px 0 0;
}

.home-date,
.home-location {
  margin: 0;
  font-size: clamp(28px, 3.4vw, 38px);
  font-weight: 400;
  line-height: 1.12;
}

.home-location {
  text-align: right;
}

.home-intro {
  min-height: 90vh;
  padding: 4vh var(--page-padding) 26vh;
}

.home-intro-content {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 40px;
  min-height: 60vh;
}

.home-intro-title {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: clamp(28px, 4.2vw, 50px);
  font-weight: 400;
  line-height: 1.05;
}

.home-info-link {
  color: inherit;
  padding-bottom: 0.45em;
  font-size: 13px;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
}

.home-info-link:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.home-footer {
  background-color: black;
  padding: 18vh var(--page-padding) 26px;
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
  .home-meta,
  .home-intro-content,
  .footer-columns {
    grid-template-columns: 1fr;
  }

  .home-location {
    text-align: left;
  }

  .footer-bottom {
    display: grid;
  }
}
</style>
