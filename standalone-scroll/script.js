gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector("#sequence-canvas");
const context = canvas.getContext("2d");

const frameStart = 121;
const frameEnd = 146;
const frameCount = frameEnd - frameStart + 1;
const imageFolder = "../data/W.I.def";
const images = [];

const sequence = {
  targetFrame: 0,
  displayedFrame: 0,
};

const sequenceScrollDistance = 2600;
const lerpFactor = 0.14;
const minFrameDelta = 0.001;

let canvasWidth = 0;
let canvasHeight = 0;
let animationFrameId = null;
let isRendering = false;

/*
  AVISO IMPORTANTE PARA EL EQUIPO:
  Esta interpolacion suaviza mucho la percepcion, pero solo tenemos 26 imagenes
  reales. Para una fluidez 100% perfecta tipo Apple, la solucion ideal es
  exportar mas fotogramas desde After Effects, por ejemplo 60 o 90 frames,
  para que el navegador tenga mas informacion visual por cada pixel de scroll.
*/

// Construye nombres tipo 00121.jpg, 00122.jpg... 00146.jpg.
const getFramePath = (frameNumber) => {
  const paddedNumber = String(frameNumber).padStart(5, "0");
  return `${imageFolder}/${paddedNumber}.jpg`;
};

// Precarga todos los fotogramas antes de iniciar ScrollTrigger.
const preloadImages = () => {
  const loadPromises = [];

  for (let frameNumber = frameStart; frameNumber <= frameEnd; frameNumber += 1) {
    const image = new Image();
    image.src = getFramePath(frameNumber);
    images.push(image);

    loadPromises.push(
      new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = () => {
          console.warn(`No se pudo cargar el fotograma: ${image.src}`);
          resolve();
        };
      }),
    );
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

// Calcula el recorte necesario para dibujar la imagen cubriendo todo el canvas.
const getCoverDrawSettings = (image) => {
  if (!image || !image.complete || image.naturalWidth === 0) return;

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

// Dibuja una imagen con modo cover y alfa opcional para poder interpolar.
const drawImageCover = (image, alpha = 1) => {
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

const render = () => {
  const safeFrame = gsap.utils.clamp(0, frameCount - 1, sequence.displayedFrame);
  const lowerFrame = Math.floor(safeFrame);
  const upperFrame = Math.min(lowerFrame + 1, frameCount - 1);
  const blend = safeFrame - lowerFrame;

  context.clearRect(0, 0, canvasWidth, canvasHeight);
  drawImageCover(images[lowerFrame], 1);

  if (upperFrame !== lowerFrame && blend > 0) {
    drawImageCover(images[upperFrame], blend);
  }
};

const tick = () => {
  const distance = sequence.targetFrame - sequence.displayedFrame;
  sequence.displayedFrame += distance * lerpFactor;

  if (Math.abs(distance) < minFrameDelta) {
    sequence.displayedFrame = sequence.targetFrame;
    render();
    isRendering = false;
    animationFrameId = null;
    return;
  }

  render();
  animationFrameId = requestAnimationFrame(tick);
};

const requestRenderLoop = () => {
  if (isRendering) return;

  isRendering = true;
  animationFrameId = requestAnimationFrame(tick);
};

const initScrollAnimation = () => {
  setCanvasSize();
  render();

  gsap.to(sequence, {
    targetFrame: frameCount - 1,
    ease: "power1.out",
    scrollTrigger: {
      trigger: ".canvas-section",
      start: "top top",
      end: `+=${sequenceScrollDistance}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
    onUpdate: requestRenderLoop,
  });
};

window.addEventListener("resize", () => {
  setCanvasSize();
  render();
  ScrollTrigger.refresh();
});

preloadImages().then(initScrollAnimation);
