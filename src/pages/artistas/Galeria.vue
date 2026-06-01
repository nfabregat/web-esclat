<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { artists } from "@/data/artists";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const selectedLetter = ref("Todos");

const letters = computed(() => {
  const uniqueLetters = new Set(
    artists.map((artist) => artist.name.charAt(0).toUpperCase()),
  );

  return ["Todos", ...Array.from(uniqueLetters).sort()];
});

const visibleArtists = computed(() => {
  if (selectedLetter.value === "Todos") {
    return artists;
  }

  return artists.filter((artist) =>
    artist.name.toUpperCase().startsWith(selectedLetter.value),
  );
});
</script>

<template>
  <main class="artists-gallery-page">
    <section class="artists-gallery-hero">
      <div class="artists-gallery-hero-copy">
        <p class="artists-gallery-kicker font-monument">ARCHIVO VISUAL</p>
        <h1 class="artists-gallery-title font-monument">GALERÍA DE ARTISTAS</h1>
        <p class="artists-gallery-text">
          Un recorrido limpio y editorial por los artistas del festival. Cuando subas el
          Excel, conectamos estos datos y la dejamos lista.
        </p>
      </div>

      <div class="artists-gallery-meta font-monument">
        <p class="artists-gallery-count">
          {{ visibleArtists.length.toString().padStart(2, "0") }}
          <span>artistas</span>
        </p>
        <RouterLink class="artists-gallery-back" to="/artistas">
          VOLVER AL CARRUSEL
        </RouterLink>
      </div>
    </section>

    <section class="artists-gallery-filters" aria-label="Filtros de artistas">
      <button
        v-for="letter in letters"
        :key="letter"
        type="button"
        class="filter-chip font-monument"
        :class="{ 'filter-chip--active': selectedLetter === letter }"
        @click="selectedLetter = letter"
      >
        {{ letter }}
      </button>
    </section>

    <section class="artists-gallery-grid" aria-label="Galería de artistas">
      <Card
        v-for="artist in visibleArtists"
        :key="artist.name"
        class="artist-card"
      >
        <div class="artist-card-image-wrap">
          <img :src="artist.image" :alt="artist.name" class="artist-card-image" />
        </div>

        <CardHeader>
          <CardTitle>{{ artist.name }}</CardTitle>
          <CardDescription>
            Artista del festival
          </CardDescription>
        </CardHeader>

        <CardContent class="artist-card-content">
          <p class="artist-card-note">
            Vista previa editorial pensada para integrar la información del Excel.
          </p>
        </CardContent>
      </Card>
    </section>
  </main>
</template>

<style scoped>
.artists-gallery-page {
  min-height: 100vh;
  padding: 0 32px 72px;
  background:
    radial-gradient(circle at top left, rgb(255 255 255 / 5%), transparent 28%),
    radial-gradient(circle at top right, rgb(255 255 255 / 3%), transparent 24%),
    #000;
  color: white;
}

.artists-gallery-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(240px, 0.7fr);
  gap: 32px;
  min-height: calc(100vh - 92px);
  padding: 32px 0 24px;
  align-items: end;
}

.artists-gallery-hero-copy {
  max-width: 52rem;
}

.artists-gallery-kicker {
  margin: 0 0 16px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.28em;
  color: rgb(255 255 255 / 56%);
}

.artists-gallery-title {
  margin: 0;
  font-size: clamp(40px, 6vw, 86px);
  line-height: 0.95;
  font-weight: 900;
}

.artists-gallery-text {
  max-width: 42ch;
  margin: 18px 0 0;
  font-size: 15px;
  line-height: 1.7;
  letter-spacing: 0.02em;
  color: rgb(255 255 255 / 66%);
}

.artists-gallery-meta {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
  justify-content: flex-end;
}

.artists-gallery-count {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-size: clamp(28px, 4vw, 54px);
  line-height: 1;
  text-align: right;
}

.artists-gallery-count span {
  margin-top: 10px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.32em;
  color: rgb(255 255 255 / 56%);
}

.artists-gallery-back {
  color: white;
  font-size: 11px;
  letter-spacing: 0.26em;
  text-decoration: none;
  text-transform: uppercase;
}

.artists-gallery-back:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.artists-gallery-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
}

.filter-chip {
  border: 1px solid rgb(255 255 255 / 12%);
  background: rgb(255 255 255 / 4%);
  color: rgb(255 255 255 / 72%);
  padding: 10px 14px;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
}

.filter-chip:hover {
  border-color: rgb(255 255 255 / 28%);
  background: rgb(255 255 255 / 8%);
  color: white;
}

.filter-chip--active {
  border-color: rgb(255 255 255 / 42%);
  background: rgb(255 255 255 / 12%);
  color: white;
}

.artists-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.artist-card {
  background: rgb(255 255 255 / 2%);
}

.artist-card:hover {
  transform: translateY(-2px);
}

.artist-card-image-wrap {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1 / 1;
}

.artist-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(6%);
  transition: transform 300ms ease;
}

.artist-card:hover .artist-card-image {
  transform: scale(1.03);
}

.artist-card-content {
  padding-top: 0;
}

.artist-card-note {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: rgb(255 255 255 / 56%);
}

@media (max-width: 1024px) {
  .artists-gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .artists-gallery-page {
    padding: 0 18px 56px;
  }

  .artists-gallery-hero {
    grid-template-columns: 1fr;
    min-height: calc(100svh - 76px);
    padding-top: 24px;
  }

  .artists-gallery-meta {
    align-items: flex-start;
  }

  .artists-gallery-count {
    text-align: left;
  }

  .artists-gallery-grid {
    grid-template-columns: 1fr;
  }
}
</style>
