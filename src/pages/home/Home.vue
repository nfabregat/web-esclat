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
