<template>
  <main class="home">
    <section ref="scrollContainer" class="home-sequence">
      <canvas
        ref="animationCanvas"
        class="home-sequence-canvas"
        :class="{ 'is-hidden': !isSequenceActive }"
      ></canvas>

      <div class="home-meta font-monument" :class="{ 'is-hidden': !isSequenceActive }">
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

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { RouterLink } from "vue-router";

const scrollContainer = ref<HTMLElement | null>(null);
const animationCanvas = ref<HTMLCanvasElement | null>(null);
const isSequenceActive = ref(true);

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

  console.log("¡Canvas inicializado con éxito!");

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

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
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

  const updateFrameFromWindowScroll = () => {
    const sectionTop = container.offsetTop;
    const sectionHeight = container.offsetHeight;
    const scrollDistance = Math.max(sectionHeight - window.innerHeight, 1);
    const localScroll = window.scrollY - sectionTop;
    const progress = clamp(localScroll / scrollDistance, 0, 1);

    targetFrame = progress * (frameCount - 1);
    isSequenceActive.value = localScroll <= scrollDistance;

    console.log(
      `Frame actual: ${Math.round(targetFrame + frameStart)} | progreso: ${progress.toFixed(3)} | scrollY: ${Math.round(window.scrollY)}`,
    );
  };

  const animate = () => {
    const distance = targetFrame - displayedFrame;
    displayedFrame += distance * lerpFactor;

    if (Math.abs(distance) < 0.001) {
      displayedFrame = targetFrame;
    }

    renderFrame();
    animationFrameId = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    setCanvasSize();
    updateFrameFromWindowScroll();
    renderFrame();
  };

  cleanupAnimation = () => {
    window.removeEventListener("scroll", updateFrameFromWindowScroll);
    window.removeEventListener("resize", handleResize);

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
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
  animationFrameId = requestAnimationFrame(animate);

  window.addEventListener("scroll", updateFrameFromWindowScroll, { passive: true });
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
  transition: opacity 120ms ease;
}

.home-sequence-canvas.is-hidden {
  opacity: 0;
  pointer-events: none;
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
  transition: opacity 120ms ease;
}

.home-meta.is-hidden {
  opacity: 0;
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
  min-height: 78vh;
  padding: clamp(42px, 8vh, 88px) var(--page-padding) clamp(90px, 20vh, 220px);
  background-color: #080808;
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
