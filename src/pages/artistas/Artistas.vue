<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { ArrowRight } from "lucide-vue-next";
import { artists } from "@/data/artists";

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
  <main class="artists-page min-h-[200vh] bg-black text-white">
    <section class="artists-hero relative flex min-h-screen items-end">
      <h1
        class="artists-title font-monument absolute bottom-8 left-8 text-[clamp(40px,6vw,64px)] font-normal leading-none md:bottom-10 md:left-10 lg:bottom-8 lg:left-8"
      >
        ARTISTAS
      </h1>
    </section>

    <section
      id="carrusel"
      class="artists-carousel relative min-h-screen overflow-hidden px-4 py-[112px] sm:px-6 sm:py-[124px] lg:px-8 lg:py-[140px]"
    >
      <div
        class="artists-controls absolute left-4 right-4 top-6 z-10 flex justify-end sm:left-6 sm:right-6 md:right-10 lg:right-11"
      >
        <RouterLink
          class="artists-view-all font-monument inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-black no-underline shadow-[0_10px_30px_rgba(255,255,255,0.12)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4 md:text-xs md:px-5 md:py-2.5"
          to="/artistas/galeria"
        >
          <span>VER TODOS</span>
          <ArrowRight :size="14" />
        </RouterLink>
      </div>

      <div
        tabindex="0"
        class="artists-stage outline-none"
        aria-label="Carrusel de artistas. Usa las flechas izquierda y derecha del teclado para navegar."
      >
        <div
          class="artists-track flex w-full gap-8 transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(calc(-${activeSlide} * (100% + 32px)))` }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="artists-slide grid w-full max-w-full flex-[0_0_100%] grid-cols-1 gap-4 box-border md:grid-cols-3 md:gap-6"
          >
            <article
              v-for="artist in slide"
              :key="artist.name"
              class="artist-card flex min-w-0 flex-row items-center gap-4 md:flex-col md:items-start md:gap-4"
            >
              <img
                :src="artist.image"
                :alt="artist.name"
                class="artist-image h-[9.5rem] w-[9.5rem] shrink-0 object-cover md:h-auto md:w-full"
              />
              <h2 class="artist-name text-[1.1rem] font-normal leading-tight md:text-base">
                {{ artist.name.toUpperCase() }}
              </h2>
            </article>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.artists-title {
  line-height: 1;
}

.artists-stage:focus-visible .artists-track {
  outline: 1px solid rgb(255 255 255 / 28%);
  outline-offset: 6px;
}

.artists-slide {
  align-items: start;
}

.artist-image {
  border: 0.5px solid rgb(255 255 255 / 45%);
  background-color: transparent;
  aspect-ratio: 1 / 1;
}

@media (max-width: 760px) {
  .artists-carousel {
    padding-top: 72px;
    padding-bottom: 48px;
  }

  .artists-stage:focus-visible .artists-track {
    outline-offset: 4px;
  }

  .artists-slide {
    gap: 16px;
  }

  .artist-card {
    gap: 14px;
    align-items: stretch;
  }

  .artist-image {
    width: 100%;
    height: clamp(13rem, 42vw, 16rem);
  }

  .artist-name {
    font-size: 1.12rem;
    letter-spacing: 0.04em;
  }
}
</style>
