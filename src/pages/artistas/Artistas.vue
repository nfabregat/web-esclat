<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const artists = [
  "RICARDO VILLALOBOS",
  "ARCA",
  "ALVA NOTO",
  "ARTISTA 1",
  "ARTISTA 2",
  "ARTISTA 3",
  "ARTISTA 4",
  "ARTISTA 5",
  "ARTISTA 6",
];

const activeSlide = ref(0);
const dragStartX = ref(0);
const slides = computed(() => {
  const groups = [];

  for (let i = 0; i < artists.length; i += 3) {
    groups.push(artists.slice(i, i + 3));
  }

  return groups;
});

let carouselInterval: number | undefined;

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % slides.value.length;
};

const startDrag = (event: MouseEvent | TouchEvent) => {
  const pointX = "touches" in event ? event.touches[0]?.clientX : event.clientX;

  if (pointX === undefined) return;

  dragStartX.value = pointX;
};

const endDrag = (event: MouseEvent | TouchEvent) => {
  const endX = "changedTouches" in event ? event.changedTouches[0]?.clientX : event.clientX;

  if (endX === undefined) return;

  const distance = dragStartX.value - endX;

  if (distance > 40) {
    nextSlide();
  }
};

onMounted(() => {
  carouselInterval = window.setInterval(nextSlide, 5000);
});

onUnmounted(() => {
  window.clearInterval(carouselInterval);
});
</script>

<template>
  <main class="artists-page">
    <section class="artists-hero">
      <h1 class="artists-title font-monument">ARTISTAS</h1>
    </section>

    <section
      class="artists-carousel"
      @mousedown="startDrag"
      @mouseup="endDrag"
      @touchstart="startDrag"
      @touchend="endDrag"
    >
      <div
        class="artists-track"
        :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
      >
        <div v-for="(slide, index) in slides" :key="index" class="artists-slide">
          <article v-for="artist in slide" :key="artist" class="artist-card">
            <div class="artist-image"></div>
            <h2 class="artist-name">{{ artist }}</h2>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.artists-page {
  min-height: 200vh;
  background-color: black;
  color: white;
}

.artists-hero {
  position: relative;
  min-height: 100vh;
}

.artists-title {
  position: absolute;
  bottom: 32px;
  left: 32px;
  font-size: 64px;
  font-weight: 900;
  line-height: 1;
}

.artists-carousel {
  overflow: hidden;
  min-height: 100vh;
  padding: 140px 32px 80px;
  cursor: grab;
}

.artists-carousel:active {
  cursor: grabbing;
}

.artists-track {
  display: flex;
  transition: transform 500ms ease;
}

.artists-slide {
  display: grid;
  min-width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  align-items: start;
}

.artist-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-image {
  aspect-ratio: 1 / 1;
  border: 0.5px solid rgb(255 255 255 / 45%);
  background-color: transparent;
}

.artist-name {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
}
</style>
