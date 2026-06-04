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

const FRAME_COUNT = frameSources.length;
const ANIMATION_DURATION = 1080;
const HOVER_PHASE_DURATION = ANIMATION_DURATION;
const HOVER_PAUSE_DURATION = 2000;
const HOVER_TOTAL_DURATION = HOVER_PHASE_DURATION * 2 + HOVER_PAUSE_DURATION;

let frames: HTMLImageElement[] = [];
let framesLoadPromise: Promise<void> | null = null;
let animationFrameId = 0;
let hoverAnimationFrameId = 0;
let isAnimationRunning = false;
let isHoverSequenceRunning = false;
let isComponentMounted = false;
let isAnimationComplete = false;
let isHoverInteractionEnabled = false;
let animationStartTime = 0;
let hoverSequenceStartTime = 0;
let currentProgress = 0;
let hoverFramePosition = FRAME_COUNT - 1;
let canvasWidth = 0;
let canvasHeight = 0;
let canvasPixelRatio = 1;
let sourceAspectRatio = 16 / 9;
let resizeObserver: ResizeObserver | null = null;
let removeHoverListeners = () => {};
let drawBox = {
  offsetX: 0,
  offsetY: 0,
  drawWidth: 0,
  drawHeight: 0,
};

const getVerticalFocalPoint = () => {
  const viewportWidth = window.innerWidth;

  if (viewportWidth <= 760) {
    return 0.5;
  }

  if (viewportWidth < 1100) {
    return 0.4;
  }

  return 0.33;
};

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

const drawFrame = (frameIndex: number, alpha = 1) => {
  const context = getCanvasContext();
  const image = frames[frameIndex];

  if (!context || !image || !image.complete || image.naturalWidth === 0) {
    return;
  }

  context.globalAlpha = alpha;
  context.drawImage(
    image,
    drawBox.offsetX,
    drawBox.offsetY,
    drawBox.drawWidth,
    drawBox.drawHeight,
  );
  context.globalAlpha = 1;
};

const renderFramePosition = (framePosition: number) => {
  const context = getCanvasContext();
  if (!context || canvasWidth === 0 || canvasHeight === 0 || frames.length === 0) {
    return;
  }

  const safeFramePosition = Math.min(Math.max(framePosition, 0), FRAME_COUNT - 1);
  const lowerFrame = Math.floor(safeFramePosition);
  const upperFrame = Math.min(lowerFrame + 1, FRAME_COUNT - 1);
  const blend = safeFramePosition - lowerFrame;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawFrame(lowerFrame, 1);

  if (upperFrame !== lowerFrame && blend > 0) {
    drawFrame(upperFrame, blend);
  }
};

const renderCurrentFrame = () => {
  if (isHoverSequenceRunning) {
    renderFramePosition(hoverFramePosition);
    return;
  }

  if (isAnimationComplete) {
    renderFramePosition(FRAME_COUNT - 1);
    return;
  }

  renderFramePosition(currentProgress * (FRAME_COUNT - 1));
};

const easeInOutCubic = (value: number) => {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
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

  if (
    canvasWidth === nextWidth &&
    canvasHeight === nextHeight &&
    canvasPixelRatio === pixelRatio
  ) {
    return;
  }

  canvasWidth = nextWidth;
  canvasHeight = nextHeight;
  canvasPixelRatio = pixelRatio;

  canvas.width = Math.floor(canvasWidth * pixelRatio);
  canvas.height = Math.floor(canvasHeight * pixelRatio);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  const canvasRatio = canvasWidth / canvasHeight;
  if (sourceAspectRatio > canvasRatio) {
    drawBox.drawHeight = canvasHeight;
    drawBox.drawWidth = canvasHeight * sourceAspectRatio;
    drawBox.offsetX = (canvasWidth - drawBox.drawWidth) / 2;
    drawBox.offsetY = 0;
  } else {
    const focalPointY = getVerticalFocalPoint();
    drawBox.drawWidth = canvasWidth;
    drawBox.drawHeight = canvasWidth / sourceAspectRatio;
    drawBox.offsetX = 0;
    drawBox.offsetY = (canvasHeight - drawBox.drawHeight) * focalPointY;
  }

  renderCurrentFrame();
};

const preloadFrames = async () => {
  if (framesLoadPromise) {
    return framesLoadPromise;
  }

  framesLoadPromise = Promise.all(
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
  ).then((loadedFrames) => {
    frames = loadedFrames;
    sourceAspectRatio = loadedFrames[0]?.naturalWidth && loadedFrames[0]?.naturalHeight
      ? loadedFrames[0].naturalWidth / loadedFrames[0].naturalHeight
      : 16 / 9;
  });

  return framesLoadPromise;
};

const stopHoverAnimation = () => {
  if (hoverAnimationFrameId) {
    window.cancelAnimationFrame(hoverAnimationFrameId);
    hoverAnimationFrameId = 0;
  }
};

const runHoverSequence = (timestamp: number) => {
  if (!isHoverSequenceRunning) return;

  if (!hoverSequenceStartTime) {
    hoverSequenceStartTime = timestamp;
  }

  const elapsed = timestamp - hoverSequenceStartTime;

  if (elapsed < HOVER_PHASE_DURATION) {
    const phaseProgress = easeInOutCubic(Math.min(elapsed / HOVER_PHASE_DURATION, 1));
    hoverFramePosition = (FRAME_COUNT - 1) * (1 - phaseProgress);
  } else if (elapsed < HOVER_PHASE_DURATION + HOVER_PAUSE_DURATION) {
    hoverFramePosition = 0;
  } else if (elapsed < HOVER_TOTAL_DURATION) {
    const phaseElapsed = elapsed - HOVER_PHASE_DURATION - HOVER_PAUSE_DURATION;
    const phaseProgress = easeInOutCubic(Math.min(phaseElapsed / HOVER_PHASE_DURATION, 1));
    hoverFramePosition = (FRAME_COUNT - 1) * phaseProgress;
  } else {
    hoverFramePosition = FRAME_COUNT - 1;
    isHoverSequenceRunning = false;
    hoverSequenceStartTime = 0;
    hoverAnimationFrameId = 0;
    renderFramePosition(hoverFramePosition);
    return;
  }

  renderFramePosition(hoverFramePosition);
  hoverAnimationFrameId = window.requestAnimationFrame(runHoverSequence);
};

const startHoverSequence = () => {
  if (!isHoverInteractionEnabled || !isAnimationComplete || isHoverSequenceRunning) {
    return;
  }

  isHoverSequenceRunning = true;
  hoverSequenceStartTime = 0;
  hoverFramePosition = FRAME_COUNT - 1;
  hoverAnimationFrameId = window.requestAnimationFrame(runHoverSequence);
};

const stopAnimation = () => {
  isAnimationRunning = false;
  animationStartTime = 0;
  currentProgress = 0;
  isAnimationComplete = false;
  isHoverSequenceRunning = false;
  hoverSequenceStartTime = 0;
  hoverFramePosition = FRAME_COUNT - 1;
  isHoverInteractionEnabled = false;

  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  }

  stopHoverAnimation();

  resizeObserver?.disconnect();
  resizeObserver = null;
  removeHoverListeners();
  removeHoverListeners = () => {};
};

const tick = (timestamp: number) => {
  if (!isAnimationRunning || isAnimationComplete) return;

  if (!animationStartTime) {
    animationStartTime = timestamp;
  }

  const elapsed = timestamp - animationStartTime;
  const nextProgress = Math.min(elapsed / ANIMATION_DURATION, 1);
  currentProgress = nextProgress;

  renderFramePosition(nextProgress * (FRAME_COUNT - 1));

  if (nextProgress >= 1) {
    isAnimationComplete = true;
    isAnimationRunning = false;
    animationFrameId = 0;
    hoverFramePosition = FRAME_COUNT - 1;
    renderFramePosition(FRAME_COUNT - 1);
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

  currentProgress = 0;
  animationStartTime = 0;
  isAnimationRunning = true;
  isAnimationComplete = false;
  isHoverSequenceRunning = false;
  hoverSequenceStartTime = 0;
  hoverFramePosition = FRAME_COUNT - 1;
  resizeCanvas();
  animationFrameId = window.requestAnimationFrame(tick);
};

onMounted(async () => {
  isComponentMounted = true;
  await nextTick();
  void startAnimation();

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener("orientationchange", resizeCanvas, { passive: true });

  if (typeof ResizeObserver !== "undefined" && animationStage.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(animationStage.value);
  }

  isHoverInteractionEnabled = window.innerWidth > 760;

  const stage = animationStage.value;
  if (stage && isHoverInteractionEnabled) {
    const handleMouseEnter = () => {
      startHoverSequence();
    };

    stage.addEventListener("mouseenter", handleMouseEnter);

    removeHoverListeners = () => {
      stage.removeEventListener("mouseenter", handleMouseEnter);
    };
  }

  window.requestAnimationFrame(() => {
    resizeCanvas();
  });
});

onUnmounted(() => {
  isComponentMounted = false;
  stopAnimation();
  window.removeEventListener("resize", resizeCanvas);
  window.removeEventListener("orientationchange", resizeCanvas);
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
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 100dvh;
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
  width: 100%;
  min-height: clamp(460px, 58vh, 780px);
  margin-top: clamp(22px, 4vw, 42px);
  margin-inline: calc(var(--page-padding) * -1);
  width: calc(100% + (var(--page-padding) * 2));
  align-self: stretch;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 58%, rgb(255 255 255 / 8%), transparent 58%),
    linear-gradient(180deg, rgb(255 255 255 / 2%), transparent 18%, transparent 82%, rgb(255 255 255 / 4%));
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
  .tickets-page {
    grid-template-rows: auto auto;
    min-height: 100svh;
  }

  .tickets-content {
    padding-top: clamp(34px, 5vh, 52px);
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
    height: clamp(240px, 34svh, 360px);
    min-height: clamp(240px, 34svh, 360px);
    margin-top: 16px;
    margin-bottom: 0;
  }
}

@media (max-width: 380px) {
  .tickets-page {
    --page-padding: 18px;
  }

  .tickets-content {
    padding-top: clamp(28px, 4vh, 40px);
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
    height: clamp(220px, 31svh, 300px);
    min-height: clamp(220px, 31svh, 300px);
    margin-top: 14px;
  }
}
</style>
