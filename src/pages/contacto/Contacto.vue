<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";

const name = ref("");
const email = ref("");
const subject = ref("");
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

const DESKTOP_IMAGE_Y_SHIFT = 210;
const MEDIUM_IMAGE_Y_SHIFT = 174;
const MOBILE_IMAGE_Y_SHIFT = 132;

const submitContact = () => {
  name.value = "";
  email.value = "";
  subject.value = "";
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
    drawBox.drawWidth = canvasWidth;
    drawBox.drawHeight = canvasWidth / sourceAspectRatio;
    drawBox.offsetX = 0;
    drawBox.offsetY = (canvasHeight - drawBox.drawHeight) / 2;
  }

  if (window.matchMedia("(min-width: 1025px)").matches) {
    const centerX = drawBox.offsetX + drawBox.drawWidth / 2;
    const minDesktopDrawHeight = canvasHeight + DESKTOP_IMAGE_Y_SHIFT;

    if (drawBox.drawHeight < minDesktopDrawHeight) {
      drawBox.drawHeight = minDesktopDrawHeight;
      drawBox.drawWidth = drawBox.drawHeight * sourceAspectRatio;
      drawBox.offsetX = centerX - drawBox.drawWidth / 2;
    }

    drawBox.offsetY -= DESKTOP_IMAGE_Y_SHIFT;
  } else if (window.matchMedia("(min-width: 761px)").matches) {
    const centerX = drawBox.offsetX + drawBox.drawWidth / 2;
    const minMediumDrawHeight = canvasHeight + MEDIUM_IMAGE_Y_SHIFT;

    if (drawBox.drawHeight < minMediumDrawHeight) {
      drawBox.drawHeight = minMediumDrawHeight;
      drawBox.drawWidth = drawBox.drawHeight * sourceAspectRatio;
      drawBox.offsetX = centerX - drawBox.drawWidth / 2;
    }

    drawBox.offsetY -= MEDIUM_IMAGE_Y_SHIFT;
  } else {
    const centerX = drawBox.offsetX + drawBox.drawWidth / 2;
    const minMobileDrawHeight = canvasHeight + MOBILE_IMAGE_Y_SHIFT;

    if (drawBox.drawHeight < minMobileDrawHeight) {
      drawBox.drawHeight = minMobileDrawHeight;
      drawBox.drawWidth = drawBox.drawHeight * sourceAspectRatio;
      drawBox.offsetX = centerX - drawBox.drawWidth / 2;
    }

    drawBox.offsetY -= MOBILE_IMAGE_Y_SHIFT;
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
  <main class="contact-page">
    <section class="contact-hero">
      <h1 class="contact-title font-monument">CONTÁCTANOS</h1>
    </section>

    <section class="contact-form-section">
      <form class="contact-form" novalidate @submit.prevent="submitContact">
        <label class="contact-field">
          <input
            v-model="name"
            type="text"
            placeholder="NOMBRE Y APELLIDOS"
            aria-label="Nombre y apellidos"
          />
        </label>

        <label class="contact-field">
          <input
            v-model="email"
            type="text"
            placeholder="E-MAIL"
            aria-label="E-mail"
          />
        </label>

        <label class="contact-field">
          <input
            v-model="subject"
            type="text"
            placeholder="ASUNTO"
            aria-label="Asunto"
          />
        </label>

        <button class="contact-submit" type="submit">ENTER</button>
      </form>
    </section>

    <div ref="animationStage" class="contact-animation" aria-hidden="true">
      <canvas ref="animationCanvas" class="contact-canvas"></canvas>
    </div>
  </main>
</template>

<style scoped>
.contact-page {
  position: relative;
  min-height: 100vh;
  background-color: black;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
}

.contact-hero {
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 28vh;
  align-items: flex-end;
  padding: 0 0 5vh var(--page-padding);
}

.contact-title {
  width: 100%;
  margin: 0;
  font-size: clamp(30px, 3.8vw, 50px);
  font-weight: 400;
  line-height: 1;
}

.contact-form-section {
  position: relative;
  z-index: 1;
  min-height: 68vh;
  padding: 0 var(--page-padding) 0 var(--page-padding);
}

.contact-form {
  display: grid;
  gap: 28px;
  width: 100%;
  margin: 0;
  padding-top: 0;
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0;
}

.contact-field {
  display: block;
}

.contact-field input {
  width: 100%;
  border: 0;
  border-bottom: 0.5px solid rgb(255 255 255 / 72%);
  border-radius: 0;
  background-color: transparent;
  color: white;
  font: inherit;
  font-size: 17px;
  outline: none;
  padding: 0 0 8px;
  text-transform: uppercase;
}

.contact-field input::placeholder {
  color: white;
  opacity: 1;
}

.contact-submit {
  justify-self: end;
  margin-top: -20px;
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 17px;
  letter-spacing: 0;
  padding: 4px 0 0;
}

.contact-submit:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.contact-animation {
  position: absolute;
  top: clamp(96px, 12vh, 140px);
  left: 0;
  width: 100%;
  height: clamp(720px, 102vh, 1120px);
  min-height: clamp(720px, 102vh, 1120px);
  z-index: 0;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 58%, rgb(255 255 255 / 8%), transparent 58%),
    linear-gradient(180deg, rgb(255 255 255 / 2%), transparent 18%, transparent 82%, rgb(255 255 255 / 4%));
}

.contact-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

@media (min-width: 761px) and (max-width: 1024px) {
  .contact-animation {
    top: 132px;
    height: clamp(660px, 92svh, 920px);
    min-height: clamp(660px, 92svh, 920px);
  }
}

@media (max-width: 760px) {
  .contact-hero {
    min-height: 24vh;
    padding-bottom: 4vh;
  }

  .contact-field span,
  .contact-field input,
  .contact-submit {
    font-size: 14px;
  }

  .contact-animation {
    top: 186px;
    height: clamp(500px, 82svh, 700px);
    min-height: clamp(500px, 82svh, 700px);
  }
}

@media (max-width: 380px) {
  .contact-animation {
    top: 168px;
    height: clamp(460px, 76svh, 620px);
    min-height: clamp(460px, 76svh, 620px);
  }
}
</style>
