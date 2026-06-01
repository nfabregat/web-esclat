<script setup lang="ts">
</script>

<template>
  <main class="artists-gallery">
    <section class="artists-gallery-hero">
      <h1 class="artists-gallery-title font-monument">GALERÍA DE ARTISTAS</h1>
      <p class="artists-gallery-copy">
        Contenido por definir.
      </p>
    </section>
  </main>
</template>

<style scoped>
.artists-gallery {
  min-height: 100vh;
  background: black;
  color: white;
}

.artists-gallery-hero {
  min-height: calc(100vh - 92px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 32px;
}

.artists-gallery-title {
  margin: 0;
  font-size: clamp(32px, 5vw, 72px);
  line-height: 1;
  font-weight: 900;
}

.artists-gallery-copy {
  margin: 16px 0 0;
  max-width: 32ch;
  color: rgb(255 255 255 / 70%);
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 760px) {
  .artists-gallery-hero {
    min-height: calc(100svh - 76px);
    padding: 24px 18px;
  }
}
</style>
