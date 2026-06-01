<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";

const artists = [
  { name: "CATERINA BARBERI", image: "/assets/artistas/1.jpg" },
  { name: "ARCA", image: "/assets/artistas/2.jpg" },
  { name: "SAMA_YAX", image: "/assets/artistas/3.jpg" },
  { name: "RICARDO VILLALOBOS", image: "/assets/artistas/4.jpg" },
  { name: "AMNESIA SCANNER", image: "/assets/artistas/5.jpg" },
  { name: "HYENAZ", image: "/assets/artistas/6.jpg" },
  { name: "HOLY HERDON", image: "/assets/artistas/7.jpg" },
  { name: "ALVA NOTO", image: "/assets/artistas/8.jpg" },
  { name: "ALESSANDRO CORTINI", image: "/assets/artistas/9.jpg" },
  { name: "LORENZO SENNI", image: "/assets/artistas/10.jpg" },
  { name: "DAME AREA", image: "/assets/artistas/11.jpg" },
  { name: "NHITTO", image: "/assets/artistas/12.jpg" },
  { name: "CLARAGUILAR", image: "/assets/artistas/13.jpg" },
  { name: "REEKO LIVE", image: "/assets/artistas/14.jpg" },
  { name: "LADRILLOVITZ", image: "/assets/artistas/15.jpg" },
  { name: "LUCAS CABELLO", image: "/assets/artistas/16.jpg" },
  { name: "SKEE MASK", image: "/assets/artistas/17.jpg" },
  { name: "ORBE", image: "/assets/artistas/18.jpg" },
  { name: "MARINA HERLOP", image: "/assets/artistas/19.jpg" },
  { name: "ACIDNENA", image: "/assets/artistas/20.jpg" },
  { name: "AISHA DEVI", image: "/assets/artistas/21.jpg" },
  { name: "JASSS", image: "/assets/artistas/22.jpg" },
  { name: "DYSTORIZON", image: "/assets/artistas/23.jpg" },
  { name: "LANARK ARTEFAX", image: "/assets/artistas/24.jpg" },
  { name: "RONE", image: "/assets/artistas/25.jpg" },
  { name: "ARIEZZZ", image: "/assets/artistas/26.jpg" },
  { name: "JLIN", image: "/assets/artistas/27.jpg" },
  { name: "OBJEKT", image: "/assets/artistas/28.jpg" },
  { name: "AKUA DJ", image: "/assets/artistas/29.jpg" },
  { name: "TARTA RELENA", image: "/assets/artistas/30.jpg" },
];

const activeSlide = ref(0);
const slides = computed(() => {
  const groups: { name: string; image: string }[][] = [];

  for (let i = 0; i < artists.length; i += 3) {
    groups.push(artists.slice(i, i + 3));
  }

  return groups;
});

let carouselInterval: number | undefined;

const stopCarousel = () => {
  if (carouselInterval !== undefined) {
    window.clearInterval(carouselInterval);
    carouselInterval = undefined;
  }
};

const startCarousel = () => {
  stopCarousel();
  carouselInterval = window.setInterval(() => {
    nextSlide();
  }, 5000);
};

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  activeSlide.value =
    (activeSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToNextSlide = () => {
  nextSlide();
  startCarousel();
};

const goToPrevSlide = () => {
  prevSlide();
  startCarousel();
};

const handleCarouselKeydown = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;

  if (
    target &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable)
  ) {
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPrevSlide();
    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    goToNextSlide();
    return;
  }
};

onMounted(() => {
  startCarousel();
  window.addEventListener("keydown", handleCarouselKeydown);
});

onUnmounted(() => {
  stopCarousel();
  window.removeEventListener("keydown", handleCarouselKeydown);
});
</script>

<template>
  <main class="artists-page">
    <section class="artists-hero">
      <h1 class="artists-title font-monument">ARTISTAS</h1>
    </section>

    <section class="artists-carousel">
      <div class="artists-controls">
        <RouterLink class="artists-view-all font-monument" to="/artistas/galeria">
          VER TODOS
        </RouterLink>
      </div>

      <div
        tabindex="0"
        class="artists-stage"
        aria-label="Carrusel de artistas. Usa las flechas izquierda y derecha del teclado para navegar."
      >
        <div
          class="artists-track"
          :style="{ transform: `translateX(calc(-${activeSlide} * (100% + 32px)))` }"
        >
          <div v-for="(slide, index) in slides" :key="index" class="artists-slide">
            <article v-for="artist in slide" :key="artist.name" class="artist-card">
              <img :src="artist.image" :alt="artist.name" class="artist-image" />
              <h2 class="artist-name">{{ artist.name }}</h2>
            </article>
          </div>
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
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  padding: 140px 32px 80px;
}

.artists-controls {
  position: absolute;
  top: 32px;
  right: 44px;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
}

.artists-view-all {
  color: white;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.24em;
  line-height: 1;
  text-decoration: none;
  text-transform: uppercase;
}

.artists-view-all:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.artists-view-all:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}

.artists-stage {
  outline: none;
}

.artists-stage:focus-visible .artists-track {
  outline: 1px solid rgb(255 255 255 / 28%);
  outline-offset: 6px;
}

.artists-track {
  display: flex;
  width: 100%;
  gap: 32px;
  transition: transform 500ms ease;
}

.artists-slide {
  display: grid;
  flex: 0 0 100%;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  align-items: start;
}

.artist-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.artist-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  border: 0.5px solid rgb(255 255 255 / 45%);
  background-color: transparent;
  object-fit: cover;
}

.artist-name {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
}

@media (max-width: 760px) {
  .artists-carousel {
    padding: 112px 18px 64px;
  }

  .artists-controls {
    top: 20px;
    right: 24px;
    left: 18px;
  }

  .artists-view-all {
    font-size: 11px;
    letter-spacing: 0.18em;
  }

  .artists-stage:focus-visible .artists-track {
    outline-offset: 4px;
  }
}
</style>
