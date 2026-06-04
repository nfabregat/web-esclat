<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const email = ref("");
const isSent = ref(false);
const animationCanvas = ref<HTMLCanvasElement | null>(null);
const animationStage = ref<HTMLElement | null>(null);

const frameSources = Array.from(
  { length: 6 },
  (_, index) => encodeURI(`/assets/ANIMACION ENTRADAS/${index + 1}.png`),
);

let frames: HTMLImageElement[] = [];
let animationFrameId = 0;
let currentFrameIndex = 0;
let frameAccumulator = 0;
let lastTimestamp = 0;
let isAnimationRunning = false;
let isComponentMounted = false;
let canvasWidth = 0;
let canvasHeight = 0;
let resizeObserver: ResizeObserver | null = null;
let isAnimationComplete = false;

const FRAME_DURATION = 320;

const sendEmail = () => {
  if (!email.value) return;

  email.value = "";
  isSent.value = true;
};

const getCanvasContext = () => {
  const canvas = animationCanvas.value;
  if (!canvas) return null;

  return canvas.getContext("2d");
};

const resizeCanvas = () => {
  const canvas = animationCanvas.value;
  const context = getCanvasContext();
  if (!canvas || !context) return;

  const stage = animationStage.value;
  if (!stage) return;

  const { width, height } = stage.getBoundingClientRect();
  const pixelRatio = window.devicePixelRatio || 1;
  const nextWidth = Math.max(1, Math.floor(width));
  const nextHeight = Math.max(1, Math.floor(height));

  if (canvasWidth === nextWidth && canvasHeight === nextHeight) {
    return;
  }

  canvasWidth = nextWidth;
  canvasHeight = nextHeight;

  canvas.width = Math.floor(canvasWidth * pixelRatio);
  canvas.height = Math.floor(canvasHeight * pixelRatio);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  drawCurrentFrame();
};

const drawCurrentFrame = () => {
  const canvas = animationCanvas.value;
  const context = getCanvasContext();
  const image = frames[currentFrameIndex];

  if (!canvas || !context || !image || !image.complete || image.naturalWidth === 0) {
    return;
  }

  const width = canvasWidth;
  const height = canvasHeight;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let offsetX = 0;
  let offsetY = 0;

  if (imageRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imageRatio;
    offsetX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imageRatio;
    offsetY = (height - drawHeight) / 2;
  }

  context.clearRect(0, 0, width, height);
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
};

const preloadFrames = async () => {
  const loadedFrames = await Promise.all(
    frameSources.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
          image.src = src;
        }),
    ),
  );

  frames = loadedFrames;
};

const stopAnimation = () => {
  isAnimationRunning = false;
  lastTimestamp = 0;
  frameAccumulator = 0;
  isAnimationComplete = false;

  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  const canvas = animationCanvas.value;
  const context = getCanvasContext();

  if (canvas && context) {
    context.setTransform(1, 0, 0, 1, 0, 0);
  }

  resizeObserver?.disconnect();
  resizeObserver = null;
};

const tick = (timestamp: number) => {
  if (!isAnimationRunning || isAnimationComplete) return;

  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    drawCurrentFrame();
    animationFrameId = window.requestAnimationFrame(tick);
    return;
  }

  const deltaTime = timestamp - lastTimestamp;
  lastTimestamp = timestamp;
  frameAccumulator += deltaTime;

  let advancedFrames = 0;

  while (frameAccumulator >= FRAME_DURATION && !isAnimationComplete) {
    frameAccumulator -= FRAME_DURATION;
    if (currentFrameIndex < frames.length - 1) {
      currentFrameIndex += 1;
      advancedFrames += 1;
    } else {
      isAnimationComplete = true;
    }
  }

  if (advancedFrames > 0 || isAnimationComplete) {
    drawCurrentFrame();
  }

  if (isAnimationComplete) {
    isAnimationRunning = false;
    animationFrameId = 0;
    return;
  }

  animationFrameId = window.requestAnimationFrame(tick);
};

const startAnimation = async () => {
  if (isAnimationRunning) return;

  try {
    await preloadFrames();
  } catch {
    return;
  }

  if (!isComponentMounted || !animationCanvas.value) return;

  currentFrameIndex = 0;
  frameAccumulator = 0;
  lastTimestamp = 0;
  isAnimationRunning = true;
  isAnimationComplete = false;
  resizeCanvas();
  drawCurrentFrame();
  animationFrameId = window.requestAnimationFrame(tick);
};

onMounted(async () => {
  isComponentMounted = true;
  await nextTick();
  void startAnimation();

  window.addEventListener("resize", resizeCanvas, { passive: true });

  if (typeof ResizeObserver !== "undefined" && animationStage.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(animationStage.value);
  }
});

onUnmounted(() => {
  isComponentMounted = false;
  stopAnimation();
  window.removeEventListener("resize", resizeCanvas);
});
</script>

<template>
  <section class="tickets-page">
    <div class="tickets-content">
      <h1 class="tickets-title font-monument">
        <span>CONSIGUE TU</span>
        <span>ENTRADA</span>
      </h1>

      <p class="tickets-intro">
        En ESCLAT creemos que las experiencias capaces de transformar la forma en la que sentimos,
        pensamos y conectamos con los demás deben estar al alcance de todo el mundo. Por eso el
        acceso al festival es completamente gratuito. Solo necesitas dejar tu correo electrónico
        para reservar tu entrada y formar parte de esta exploración colectiva entre arte, música y
        tecnología.
      </p>

      <form class="tickets-form" @submit.prevent="sendEmail">
        <input
          v-model="email"
          class="tickets-input"
          type="email"
          :placeholder="isSent ? 'EMAIL ENVIADO CORRECTAMENTE' : 'INTRODUCE TU E-MAIL'"
          aria-label="Introduce tu e-mail"
        />
        <button class="tickets-button" type="submit">ENTER</button>
      </form>
    </div>

    <div ref="animationStage" class="tickets-animation" aria-hidden="true">
      <canvas ref="animationCanvas" class="tickets-canvas"></canvas>
    </div>
  </section>
</template>

<style scoped>
.tickets-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: black;
  color: white;
  --page-padding: max(24px, 3vw);
}

.tickets-content {
  width: auto;
  padding: 11.5vh var(--page-padding) 0;
  position: relative;
  z-index: 1;
}

.tickets-title {
  display: flex;
  gap: 0.32em;
  max-width: none;
  margin: 0 0 12px;
  font-size: clamp(30px, 3.8vw, 42px);
  font-weight: 400;
  line-height: 1.16;
}

.tickets-intro {
  max-width: 78ch;
  margin: 0 0 26px;
  font-size: clamp(11px, 0.85vw, 13px);
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.01em;
  text-align: justify;
  text-justify: inter-word;
  text-wrap: pretty;
}

.tickets-form {
  display: grid;
  grid-template-columns: 1fr auto;
  width: 100%;
  border: 0.5px solid rgb(255 255 255 / 55%);
}

.tickets-animation {
  position: relative;
  flex: 1;
  width: 100%;
  align-self: stretch;
  min-height: 32vh;
  margin-top: clamp(18px, 3vw, 34px);
  overflow: hidden;
}

.tickets-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.tickets-input {
  min-width: 0;
  border: 0;
  background-color: transparent;
  color: white;
  font: inherit;
  font-size: 16px;
  padding: 14px 20px;
  outline: none;
}

.tickets-input::placeholder {
  color: white;
  opacity: 1;
}

.tickets-button {
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0;
  padding: 14px 24px;
}

@media (max-width: 760px) {
  .tickets-content {
    padding-top: 10.5vh;
  }

  .tickets-title {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 13ch;
    margin-bottom: 16px;
    font-size: clamp(27px, 8vw, 34px);
    line-height: 1.3;
  }

  .tickets-intro {
    max-width: 41ch;
    margin-top: -2px;
    margin-bottom: 24px;
    font-size: 12px;
    line-height: 1.5;
    text-align: left;
  }

  .tickets-input {
    font-size: 14px;
    padding: 13px 14px;
  }

  .tickets-button {
    font-size: 14px;
    padding: 13px 14px;
  }

  .tickets-animation {
    min-height: 28vh;
    margin-top: 22px;
  }
}

@media (max-width: 380px) {
  .tickets-page {
    --page-padding: 18px;
  }

  .tickets-content {
    padding-top: 9.5vh;
  }

  .tickets-intro {
    max-width: none;
    margin-bottom: 20px;
    font-size: 11px;
  }

  .tickets-title {
    font-size: clamp(24px, 7.4vw, 29px);
  }

  .tickets-input,
  .tickets-button {
    font-size: 13px;
  }

  .tickets-animation {
    min-height: 26vh;
    margin-top: 18px;
  }
}
</style>
