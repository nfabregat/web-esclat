<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const products = [
  "RICARDO VILLALOBOS",
  "ARCA",
  "ALVA NOTO",
];

const activeSlide = ref(0);
const dragStartX = ref(0);
const slides = computed(() => {
  const groups = [];

  for (let i = 0; i < products.length; i += 3) {
    groups.push(products.slice(i, i + 3));
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
  <main class="shop-page">
    <section class="shop-hero">
      <h1 class="shop-title font-monument">TIENDA</h1>
    </section>

    <section
      class="shop-carousel"
      @mousedown="startDrag"
      @mouseup="endDrag"
      @touchstart="startDrag"
      @touchend="endDrag"
    >
      <div
        class="shop-track"
        :style="{ transform: `translateX(-${activeSlide * 100}%)` }"
      >
        <div v-for="(slide, index) in slides" :key="index" class="shop-slide">
          <article v-for="product in slide" :key="product" class="shop-card">
            <div class="shop-image"></div>
            <h2 class="shop-name">{{ product }}</h2>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.shop-page {
  min-height: 200vh;
  background-color: black;
  color: white;
  --page-padding: max(24px, 3vw);
}

.shop-hero {
  position: relative;
  min-height: 100vh;
}

.shop-title {
  position: absolute;
  bottom: 32px;
  left: var(--page-padding);
  font-size: clamp(46px, 6.6vw, 90px);
  font-weight: 400;
  line-height: 1;
}

.shop-carousel {
  overflow: hidden;
  min-height: 100vh;
  padding: 140px 32px 80px;
  cursor: grab;
}

.shop-carousel:active {
  cursor: grabbing;
}

.shop-track {
  display: flex;
  transition: transform 500ms ease;
}

.shop-slide {
  display: grid;
  min-width: 100%;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.shop-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shop-image {
  aspect-ratio: 4 / 5;
  border: 0.5px solid rgb(255 255 255 / 45%);
  background-color: transparent;
}

.shop-name {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2;
}

@media (max-width: 1024px) {
  .shop-hero {
    min-height: 88vh;
  }

  .shop-title {
    bottom: 32px;
    left: var(--page-padding);
    font-size: clamp(46px, 6.6vw, 90px);
  }

  .shop-carousel {
    min-height: auto;
    padding: 7vh var(--page-padding) 80px;
  }
}
</style>
