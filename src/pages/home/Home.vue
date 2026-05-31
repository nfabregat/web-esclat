<script lang="ts" setup>
import { RouterLink } from "vue-router";
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
          <span>PENSAMIENTO</span>
          <span>Y CREATIVIDAD</span>
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
  overflow-x: hidden;
  background-color: #080808;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: clamp(18px, 3vw, 48px);
}

.home-hero {
  display: flex;
  min-height: calc(100svh - 92px);
  flex-direction: column;
  justify-content: flex-end;
  padding: clamp(28px, 7vh, 72px) var(--page-padding) clamp(28px, 5vh, 54px);
}

.home-hero-image {
  width: 100%;
  min-height: clamp(280px, 48vh, 560px);
  background-color: black;
}

.home-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(18px, 3vw, 32px);
  padding: clamp(20px, 3vw, 32px) 0 0;
}

.home-date,
.home-location {
  margin: 0;
  font-size: clamp(26px, 3.4vw, 42px);
  font-weight: 400;
  line-height: 1.12;
}

.home-location {
  text-align: right;
}

.home-intro {
  min-height: 78vh;
  padding: clamp(42px, 8vh, 88px) var(--page-padding) clamp(90px, 20vh, 220px);
}

.home-intro-content {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: clamp(28px, 5vw, 68px);
  min-height: 46vh;
}

.home-intro-title {
  display: flex;
  flex-direction: column;
  margin: 0;
  max-width: 17ch;
  font-size: clamp(26px, 3.8vw, 52px);
  font-weight: 400;
  line-height: 1.08;
}

.home-info-link {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  min-height: 44px;
  color: inherit;
  font-size: clamp(12px, 1.2vw, 14px);
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  text-underline-offset: 4px;
}

.home-info-link:hover {
  text-decoration: underline;
}

@media (max-width: 760px) {
  .home-hero {
    min-height: calc(100svh - 76px);
    padding-top: 18px;
  }

  .home-hero-image {
    min-height: clamp(260px, 46svh, 420px);
  }

  .home-meta,
  .home-intro-content {
    grid-template-columns: 1fr;
  }

  .home-meta {
    gap: 16px;
  }

  .home-date,
  .home-location {
    font-size: clamp(24px, 9vw, 36px);
  }

  .home-location {
    text-align: left;
  }

  .home-intro {
    min-height: auto;
    padding-top: 56px;
    padding-bottom: 112px;
  }

  .home-intro-content {
    align-items: start;
    min-height: auto;
  }

  .home-intro-title {
    max-width: 15ch;
    font-size: clamp(25px, 7.4vw, 34px);
  }

  .home-info-link {
    margin-top: 6px;
  }
}

@media (max-width: 380px) {
  .home-intro-title {
    font-size: clamp(23px, 7vw, 30px);
  }
}
</style>
