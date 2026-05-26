<script lang="ts" setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <main class="home">
    <section class="home-hero">
      <div class="home-date font-monument">
        <p>23.10-</p>
        <p>25.10.26</p>
      </div>

      <div class="home-location font-monument">
        <p>LAS NAVES</p>
        <p>VALENCIA</p>
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
          MÁS INFO
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: 200vh;
  background-color: black;
  color: white;
}

.home-hero {
  position: relative;
  min-height: 100vh;
}

.home-date,
.home-location {
  position: absolute;
  bottom: 32px;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.15;
}

.home-date {
  left: 32px;
}

.home-location {
  right: 32px;
  text-align: left;
}

.home-intro {
  display: flex;
  min-height: 130vh;
  align-items: center;
  padding: 260px 32px 120px;
}

.home-intro-content {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 32px;
}

.home-intro-title {
  display: flex;
  flex-direction: column;
  font-size: 46px;
  font-weight: 400;
  line-height: 1.05;
}

.home-info-link {
  color: inherit;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.05;
  text-decoration: none;
}
</style>
