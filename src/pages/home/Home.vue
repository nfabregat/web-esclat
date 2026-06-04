<template>
  <main class="home">
    <section ref="scrollContainer" class="home-sequence">
      <canvas
        ref="animationCanvas"
        class="home-sequence-canvas"
        :style="sequenceCanvasStyles"
      ></canvas>

      <div
        class="home-meta font-monument"
        :class="{ 'is-complete': isRevealComplete }"
      >
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

    <section class="home-intro" :class="{ 'is-visible': isIntroVisible }">
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

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";

const scrollContainer = ref<HTMLElement | null>(null);
const animationCanvas = ref<HTMLCanvasElement | null>(null);
const revealProgress = ref(0);

const isRevealComplete = computed(() => revealProgress.value >= 0.95);
const isIntroVisible = computed(() => revealProgress.value >= 0.965);
const sequenceCanvasStyles = computed(() => {
  return {
    "--sequence-exit-progress": revealProgress.value.toFixed(4),
  };
});

let cleanupAnimation = () => {};

onMounted(async () => {
  await nextTick();

  const container = scrollContainer.value;
  const canvas = animationCanvas.value;
  const context = canvas?.getContext("2d");

  if (!container || !canvas || !context) {
    console.warn("No se pudo inicializar el canvas de la Home.");
    return;
  }

  const frameStart = 121;
  const frameEnd = 146;
  const frameCount = frameEnd - frameStart + 1;
  const imageFolder = "/assets/W.I.def";
  const lerpFactor = 0.18;

  const images: HTMLImageElement[] = [];

  let canvasWidth = 0;
  let canvasHeight = 0;
  let targetFrame = 0;
  let displayedFrame = 0;
  let animationFrameId = 0;
  let scrollRafId = 0;

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  const smoothStep = (start: number, end: number, value: number) => {
    const progress = clamp((value - start) / (end - start), 0, 1);
    return progress * progress * (3 - 2 * progress);
  };

  const getFramePath = (frameNumber: number) => {
    const paddedNumber = String(frameNumber).padStart(5, "0");
    return `${imageFolder}/${paddedNumber}.jpg`;
  };

  const preloadImages = () => {
    const loadPromises: Promise<void>[] = [];

    for (let frameNumber = frameStart; frameNumber <= frameEnd; frameNumber += 1) {
      const frameIndex = frameNumber - frameStart;
      const image = new Image();

      images[frameIndex] = image;

      loadPromises.push(
        new Promise((resolve) => {
          image.onload = () => resolve();
          image.onerror = () => {
            console.warn(`No se pudo cargar el frame ${frameNumber}: ${image.src}`);
            resolve();
          };
        }),
      );

      image.src = getFramePath(frameNumber);
    }

    return Promise.all(loadPromises);
  };

  const setCanvasSize = () => {
    const pixelRatio = window.devicePixelRatio || 1;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width = Math.floor(canvasWidth * pixelRatio);
    canvas.height = Math.floor(canvasHeight * pixelRatio);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const getCoverDrawSettings = (image: HTMLImageElement) => {
    if (!image.complete || image.naturalWidth === 0) return null;

    const imageRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imageRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imageRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    return { offsetX, offsetY, drawWidth, drawHeight };
  };

  const drawImageCover = (image: HTMLImageElement | undefined, alpha = 1) => {
    if (!image) return;

    const settings = getCoverDrawSettings(image);
    if (!settings) return;

    context.globalAlpha = alpha;
    context.drawImage(
      image,
      settings.offsetX,
      settings.offsetY,
      settings.drawWidth,
      settings.drawHeight,
    );
    context.globalAlpha = 1;
  };

  const renderFrame = () => {
    const safeFrame = clamp(displayedFrame, 0, frameCount - 1);
    const lowerFrame = Math.floor(safeFrame);
    const upperFrame = Math.min(lowerFrame + 1, frameCount - 1);
    const blend = safeFrame - lowerFrame;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawImageCover(images[lowerFrame], 1);

    if (upperFrame !== lowerFrame && blend > 0) {
      drawImageCover(images[upperFrame], blend);
    }
  };

  const startAnimation = () => {
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  const updateFrameFromWindowScroll = () => {
    const sectionTop = container.offsetTop;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollDistance = Math.max(documentHeight - window.innerHeight - sectionTop, 1);
    const localScroll = window.scrollY - sectionTop;
    const progress = clamp(localScroll / scrollDistance, 0, 1);

    targetFrame = progress * (frameCount - 1);
    revealProgress.value = smoothStep(0.72, 0.9, progress);
  };

  const animate = () => {
    animationFrameId = 0;
    const distance = targetFrame - displayedFrame;

    displayedFrame += distance * lerpFactor;

    if (Math.abs(distance) < 0.001) {
      displayedFrame = targetFrame;
    }

    renderFrame();

    if (Math.abs(targetFrame - displayedFrame) >= 0.001) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  const scheduleScrollUpdate = () => {
    if (scrollRafId) return;

    scrollRafId = requestAnimationFrame(() => {
      scrollRafId = 0;
      updateFrameFromWindowScroll();
      startAnimation();
    });
  };

  const handleResize = () => {
    setCanvasSize();
    updateFrameFromWindowScroll();
    renderFrame();
    startAnimation();
  };

  cleanupAnimation = () => {
    window.removeEventListener("scroll", scheduleScrollUpdate);
    window.removeEventListener("resize", handleResize);

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    if (scrollRafId) {
      cancelAnimationFrame(scrollRafId);
    }

    images.forEach((image) => {
      image.onload = null;
      image.onerror = null;
      image.removeAttribute("src");
    });
    images.length = 0;
  };

  setCanvasSize();
  await preloadImages();

  updateFrameFromWindowScroll();
  renderFrame();

  window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  cleanupAnimation();
});
</script>

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

.home-sequence {
  position: relative;
  height: 400vh;
  background-color: black;
}

.home-sequence-canvas {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: block;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: calc(1 - var(--sequence-exit-progress));
  pointer-events: none;
  will-change: opacity;
}

.home-meta {
  position: fixed;
  left: var(--page-padding);
  right: var(--page-padding);
  bottom: clamp(28px, 5vh, 54px);
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(18px, 3vw, 32px);
  pointer-events: none;
}

.home-meta.is-complete {
  visibility: hidden;
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
  position: relative;
  z-index: 3;
  margin-top: 0;
  min-height: auto;
  background-color: #000;
  padding: clamp(72px, 12vh, 132px) var(--page-padding) clamp(140px, 18vh, 240px);
  overflow: hidden;
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 380ms ease, transform 380ms ease;
  will-change: opacity, transform;
}

.home-intro::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: clamp(84px, 12vh, 140px);
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.45) 58%,
    #000 100%
  );
  pointer-events: none;
}

.home-intro.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.home-intro-content {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: clamp(28px, 5vw, 68px);
  min-height: auto;
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
  .home-meta,
  .home-intro-content {
    grid-template-columns: 1fr;
  }

  .home-meta {
    gap: 28px;
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
    margin-top: 0;
    background-color: #000;
    padding-top: 104px;
    padding-bottom: clamp(120px, 22vh, 190px);
    transform: translateY(34px);
  }

  .home-intro::before {
    height: clamp(96px, 14vh, 156px);
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.5) 62%,
      #000 100%
    );
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
