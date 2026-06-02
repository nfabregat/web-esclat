<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from "vue";

const festivalSpaces = [
  {
    id: "01",
    name: "Hall La Polivalent",
    description:
      "El hall principal donde se mezclan las entradas, el bar y los espacios de encuentro. Punto de conexión con las salas principales.",
    path: "M60 60 H420 V240 H60 Z",
    labelX: 80,
    labelY: 120,
  },
  {
    id: "02",
    name: "La Polivalent",
    description:
      "Espacio dedicado a workshops, instalaciones inmersivas y experiencias interactivas relacionadas con arte, música y tecnología.",
    path: "M520 60 H940 V240 H520 Z",
    labelX: 720,
    labelY: 120,
  },
  {
    id: "03",
    name: "Factoría",
    description: "Zona de experimentación sonora y creación musical en directo.",
    path: "M60 280 H360 V420 H60 Z",
    labelX: 110,
    labelY: 340,
  },
  {
    id: "04",
    name: "Visual Room",
    description:
      "Sala centrada en visuales, luces, mapping y experiencias audiovisuales inmersivas.",
    path: "M420 280 H740 V420 H420 Z",
    labelX: 540,
    labelY: 340,
  },
  {
    id: "05",
    name: "Sala de Exposiciones",
    description:
      "Espacio dedicado a arte contemporáneo, instalaciones y colaboraciones visuales.",
    path: "M760 280 H940 V420 H760 Z",
    labelX: 780,
    labelY: 340,
  },
  {
    id: "06",
    name: "Patio 1",
    description:
      "Zona exterior pensada para descansar, socializar y desconectar entre actividades. Lugar donde se encuentra el confesionario.",
    path: "M60 470 H360 V650 H60 Z",
    labelX: 100,
    labelY: 540,
  },
  {
    id: "07",
    name: "Patio 2",
    description:
      "Espacio dedicado a performances y arte urbano en vivo, incluyendo murales y acciones colectivas.",
    path: "M420 470 H760 V650 H420 Z",
    labelX: 520,
    labelY: 540,
  },
  {
    id: "08",
    name: "Vestíbulo La Mutant",
    description:
      "El escenario principal del festival. Aquí tendrán lugar las sesiones más intensas, shows audiovisuales y directos principales.",
    path: "M60 690 H940 V780 H60 Z",
    labelX: 460,
    labelY: 740,
  },
  {
    id: "09",
    name: "La Mutant",
    description:
      "El escenario principal del festival. Aquí tendrán lugar las sesiones más intensas, shows audiovisuales y directos principales.",
    path: "M60 820 H940 V900 H60 Z",
    labelX: 460,
    labelY: 860,
  },
];

const activeSpace = ref<string | null>(null);
const activeFaq = ref<string | null>(null);
const activeRule = ref<string | null>(null);

const nivel1Svg = ref<string | null>(null);
const nivel2Svg = ref<string | null>(null);
const mutantSvg = ref<string | null>(null);
const selectedMap = ref<string>("nivel1");

const currentMapSvg = computed(() => {
  if (selectedMap.value === "nivel1") return nivel1Svg.value;
  if (selectedMap.value === "nivel2") return nivel2Svg.value;
  return mutantSvg.value;
});

const loadSvgs = async () => {
  try {
    const [r1, r2, r3] = await Promise.all([
      fetch("/assets/mapa/Mapa-LASNAVES-Nivel1.svg"),
      fetch("/assets/mapa/Mapa-LASNAVES-Nivel2.svg"),
      fetch("/assets/mapa/Mapa-LASNAVES-Mutant.svg"),
    ]);

    nivel1Svg.value = r1.ok ? await r1.text() : null;
    nivel2Svg.value = r2.ok ? await r2.text() : null;
    mutantSvg.value = r3.ok ? await r3.text() : null;
  } catch (e) {
    console.error("Error loading SVGs", e);
  }
};

onMounted(() => {
  loadSvgs();
});

const mappedElements: Record<string, Element[]> = {};

const attachSvgListeners = async () => {
  await nextTick();
  const container = document.querySelector('.space-map');
  if (!container) return;
  const svg = container.querySelector('svg');
  if (!svg) return;

  // clear previous mappings
  Object.keys(mappedElements).forEach(k => delete mappedElements[k]);

  const texts = Array.from(svg.querySelectorAll('text'));
  texts.forEach((textEl) => {
    const raw = (textEl.textContent || '').trim();
    if (!raw) return;

    // normalize: accept '1' or '01'
    let id = raw;
    if (id.length === 1) id = '0' + id;

    const space = festivalSpaces.find(s => s.id === id);
    if (!space) return;

    // try to find enclosing shapes by bbox containment
    const allShapes = Array.from(svg.querySelectorAll('path, rect, polygon, polyline, g'));
    const foundShapes: Element[] = [];
    try {
      const textBox = (textEl as any).getBBox();
      allShapes.forEach((s) => {
        try {
          const box = (s as any).getBBox();
          if (
            box.x <= textBox.x + 0.5 &&
            box.y <= textBox.y + 0.5 &&
            box.x + box.width >= textBox.x + textBox.width - 0.5 &&
            box.y + box.height >= textBox.y + textBox.height - 0.5
          ) {
            // shape fully contains the text bbox
            foundShapes.push(s);
          }
        } catch (e) {
          // ignore shapes that can't compute bbox
        }
      });
    } catch (e) {
      // getBBox may fail; ignore and fallback
    }

    // fallback: siblings in same group
    if (foundShapes.length === 0) {
      const parent = textEl.parentElement || svg;
      const sibs = Array.from(parent.querySelectorAll('path, rect, polygon, polyline, g'))
        .filter(el => el !== textEl);
      mappedElements[id] = sibs.length ? sibs : [textEl];
    } else {
      mappedElements[id] = foundShapes;
    }

    const setHover = (on: boolean) => {
      const els = mappedElements[id] || [];
      els.forEach(el => el.classList.toggle('svg-area-hover', on));
      (textEl as Element).classList.toggle('svg-area-hover', on);
    };

    const setActive = (active: boolean) => {
      // remove active from others
      Object.keys(mappedElements).forEach(otherId => {
        const others = mappedElements[otherId] || [];
        others.forEach(el => el.classList.toggle('svg-area-active', false));
      });
      if (active) {
        const els = mappedElements[id] || [];
        els.forEach(el => el.classList.add('svg-area-active'));
      }
    };

    textEl.addEventListener('mouseenter', () => setHover(true));
    textEl.addEventListener('mouseleave', () => setHover(false));
    textEl.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSpace(id);
      setActive(true);
    });
    textEl.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        toggleSpace(id);
        setActive(true);
      }
    });
  });
};

watch(currentMapSvg, async () => {
  // reattach when map changes
  await nextTick();
  attachSvgListeners();
});

const toggleSpace = (space: string) => {
  activeSpace.value = activeSpace.value === space ? null : space;
};

const toggleFaq = (question: string) => {
  activeFaq.value = activeFaq.value === question ? null : question;
};

const toggleRule = (title: string) => {
  activeRule.value = activeRule.value === title ? null : title;
};

const faqItems = [
  {
    question: "¿QUÉ ES ESCLAT?",
    answer:
      "ESCLAT es una experiencia inmersiva que fusiona música electrónica, arte, tecnología y exploración sensorial. No es solo un festival: es un espacio de conexión, creatividad y experimentación colectiva inspirado en la cultura underground y futurista.",
  },
  {
    question: "¿CUÁNDO SE CELEBRA?",
    answer: "Del 23 al 25 de octubre de 2026.",
  },
  {
    question: "¿DÓNDE SE REALIZA?",
    answer: "En Les Naus, Valencia.",
  },
  {
    question: "¿QUÉ TIPO DE MÚSICA HABRÁ?",
    answer:
      "El festival estará centrado en electrónica de vanguardia, combinada con sesiones de techno, experimental, ambient, bass, hyperpop y propuestas sonoras inmersivas.",
  },
  {
    question: "¿EL FESTIVAL ES SOLO MÚSICA?",
    answer:
      "No. Además de conciertos y sesiones DJ, ESCLAT incluye instalaciones inmersivas, workshops interactivos, performances, arte urbano en vivo, moda experimental y experiencias audiovisuales.",
  },
  {
    question: "¿QUÉ SON LOS WORKSHOPS?",
    answer:
      "Son experiencias participativas diseñadas para que el público interactúe con el sonido, la tecnología y el arte. Algunos utilizan sensores biométricos, neurofeedback, producción musical en directo o creación colectiva.",
  },
  {
    question: "¿NECESITO EXPERIENCIA PREVIA PARA PARTICIPAR EN LAS ACTIVIDADES?",
    answer:
      "No. Todas las experiencias están pensadas tanto para público general como para personas interesadas en arte, música y tecnología.",
  },
  {
    question: "¿LOS WORKSHOPS TIENEN AFORO LIMITADO?",
    answer:
      "Sí. Algunas actividades tendrán plazas reducidas debido al espacio y al equipamiento técnico.",
  },
  {
    question: "¿HABRÁ COMIDA Y BEBIDA?",
    answer:
      "Sí. El recinto contará con zonas habilitadas de comida y bebida durante todo el festival.",
  },
  {
    question: "¿EL FESTIVAL ES ACCESIBLE?",
    answer:
      "ESCLAT apuesta por un espacio inclusivo y accesible. Se irá publicando información específica sobre accesibilidad y movilidad.",
  },
  {
    question: "¿HABRÁ MERCHANDISING OFICIAL?",
    answer:
      "Sí. Habrá merchandising y colaboraciones con artistas y diseñadores vinculados al universo visual del festival.",
  },
  {
    question: "¿SE PODRÁN HACER FOTOS Y VÍDEOS?",
    answer:
      "Sí, excepto en determinadas instalaciones o experiencias donde se indique lo contrario para preservar la inmersión y privacidad de los participantes.",
  },
];

const ruleItems = [
  {
    title: "NORMAS GENERALES",
    lines: [
      "Respeta a todas las personas asistentes, artistas y personal del festival.",
      "ESCLAT es un espacio inclusivo: no se tolerarán actitudes discriminatorias, violentas o de acoso.",
      "Sigue siempre las indicaciones del personal de seguridad y organización.",
      "Está prohibido dañar instalaciones, obras artísticas o equipamiento técnico.",
      "Mantén el recinto limpio y utiliza las zonas habilitadas para residuos.",
      "El acceso puede ser denegado a personas con comportamiento agresivo o inapropiado.",
    ],
  },
  {
    title: "SEGURIDAD Y ACCESO",
    lines: [
      "Será obligatorio llevar la entrada y documentación identificativa.",
      "La organización podrá realizar controles de acceso y seguridad.",
      "No está permitido acceder con objetos peligrosos o sustancias ilegales.",
      "El festival se reserva el derecho de admisión.",
    ],
  },
  {
    title: "EXPERIENCIAS INMERSIVAS Y WORKSHOPS",
    lines: [
      "Algunas actividades utilizan luces intensas, sonido elevado y estímulos visuales inmersivos.",
      "Si experimentas malestar físico o emocional, acude inmediatamente al personal del festival.",
      "Los dispositivos interactivos y tecnológicos deben utilizarse siguiendo las instrucciones del equipo técnico.",
      "Se ruega respetar la privacidad de las personas participantes en experiencias sensibles o íntimas.",
    ],
  },
  {
    title: "FOTOGRAFÍA Y CONTENIDO",
    lines: [
      "Al acceder al festival, aceptas la posible captación de imágenes y vídeos para uso promocional.",
      "Respeta las zonas donde no esté permitido grabar o fotografiar.",
    ],
  },
  {
    title: "SOSTENIBILIDAD",
    lines: [
      "ESCLAT promueve una filosofía sostenible y de respeto por el espacio.",
      "Reduce residuos y utiliza los puntos de reciclaje habilitados.",
      "Se recomienda el uso de transporte público o compartido.",
    ],
  },
  {
    title: "CONVIVENCIA",
    lines: [
      "Cuida el ambiente colectivo del festival.",
      "ESCLAT busca crear una experiencia segura, libre y consciente para todas las personas asistentes.",
    ],
  },
];

</script>

<template>
  <main class="info-page">
    <section class="info-hero">
      <h1 class="info-title font-monument">INFORMACIÓN</h1>
    </section>

    <section class="info-intro">
      <p>
        ESCLAT es una experiencia inmersiva que fusiona música electrónica,<br />
        arte, tecnología y exploración sensorial. no es solo un festival: es<br />
        un espacio de conexión, creatividad y experimentación colectiva<br />
        inspirado en la cultura underground y futurista.
      </p>
    </section>

    <section class="info-balance" aria-label="Balance del festival">
      <div class="balance-item balance-item-music">
        <h2>MÚSICA</h2>
        <div class="balance-circle balance-circle-large"></div>
        <p>60%</p>
      </div>

      <div class="balance-item balance-item-thinking">
        <h2>PENSAMIENTO Y CREATIVIDAD</h2>
        <div class="balance-circle balance-circle-small"></div>
        <p>40%</p>
      </div>
    </section>

    <section class="space-section">
      <h2 class="space-title font-monument">EL ESPACIO</h2>

      <div class="space-grid">
        <div class="space-map-card">
          <div class="space-map-header">
            <span>Mapa interactivo</span>
            <small>Hover para resaltar, click para mostrar la descripción.</small>
          </div>

          <div class="space-map-header" style="gap:10px;">
            <div style="display:flex;gap:8px;align-items:center;">
              <button
                class="space-button"
                :class="{ 'active-map-button': selectedMap === 'nivel1' }"
                type="button"
                @click="selectedMap = 'nivel1'"
              >
                Planta Baja
              </button>

              <button
                class="space-button"
                :class="{ 'active-map-button': selectedMap === 'nivel2' }"
                type="button"
                @click="selectedMap = 'nivel2'"
              >
                Planta 1
              </button>

              <button
                class="space-button"
                :class="{ 'active-map-button': selectedMap === 'mutant' }"
                type="button"
                @click="selectedMap = 'mutant'"
              >
                La Mutant
              </button>
            </div>
            <small style="color:rgba(255,255,255,0.6);">Selecciona un nivel</small>
          </div>

          <div
            class="space-map"
            role="img"
            aria-label="Mapa interactivo del espacio ESCLAT"
            v-html="currentMapSvg"
          ></div>

          <p class="map-hint">
            Si quieres un mapa real, guarda solo la imagen base en <code>src/assets/mapa-espacio.png</code> o
            <code>src/assets/mapa-espacio.svg</code> y sustituye el <code>&lt;rect&gt;</code> de fondo por la imagen.
          </p>
        </div>

        <ol class="space-list">
          <li
            v-for="space in festivalSpaces"
            :key="space.id"
            class="space-list-item"
          >
            <button
              class="space-button"
              type="button"
              @click="toggleSpace(space.id)"
            >
              {{ space.id }}. {{ space.name }}
            </button>

            <p v-if="activeSpace === space.id" class="space-description">
              {{ space.description }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section class="faq-section">
      <h2 class="section-title font-monument">DUDAS FRECUENTES</h2>

      <ul class="faq-list">
        <li
          v-for="item in faqItems"
          :key="item.question"
          class="faq-item"
        >
          <button
            class="faq-question"
            type="button"
            @click="toggleFaq(item.question)"
          >
            {{ item.question }}
          </button>

          <p v-if="activeFaq === item.question" class="faq-answer">
            {{ item.answer }}
          </p>
        </li>
      </ul>
    </section>

    <section class="rules-section">
      <h2 class="section-title font-monument">NORMAS</h2>

      <ul class="rules-list">
        <li
          v-for="item in ruleItems"
          :key="item.title"
          class="rules-item"
        >
          <button
            class="rules-question"
            type="button"
            @click="toggleRule(item.title)"
          >
            {{ item.title }}
          </button>

          <div v-if="activeRule === item.title" class="rules-answer">
            <p
              v-for="line in item.lines"
              :key="line"
            >
              {{ line }}
            </p>
          </div>
        </li>
      </ul>
    </section>

  </main>
</template>

<style scoped>
.info-page {
  min-height: 100vh;
  background-color: black;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
}

.info-hero {
  position: relative;
  min-height: 88vh;
}

.info-title {
  position: absolute;
  left: var(--page-padding);
  bottom: 32px;
  margin: 0;
  font-size: clamp(46px, 6.6vw, 90px);
  font-weight: 400;
  line-height: 1;
}

.info-intro {
  padding: 7vh var(--page-padding) 0;
}

.info-intro p {
  max-width: 720px;
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  line-height: 1.35;
  letter-spacing: 0;
  text-transform: none;
}

.info-balance {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 44vh;
  margin-top: 12vh;
  padding: 0 var(--page-padding);
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0;
}

.info-balance::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 34px;
  left: var(--page-padding);
  width: 1px;
  background-color: white;
  opacity: 0.65;
  transform: scaleX(0.5);
  transform-origin: left;
}

.info-balance::after {
  content: "";
  position: absolute;
  top: 52%;
  left: var(--page-padding);
  right: var(--page-padding);
  height: 1px;
  background-color: white;
  opacity: 0.35;
  transform: scaleY(0.5);
  transform-origin: top;
}

.balance-item {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 0;
}

.balance-item h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
}

.balance-item p {
  margin: 0;
  font-size: 16px;
  line-height: 1;
}

.balance-item-music {
  padding-left: 20px;
}

.balance-item-thinking {
  padding-left: 4vw;
}

.balance-circle {
  align-self: center;
  border-radius: 50%;
  background-color: white;
}

.balance-circle-large {
  width: min(31vw, 330px);
  aspect-ratio: 1;
  justify-self: center;
  margin-right: 3vw;
}

.balance-circle-small {
  width: min(26vw, 270px);
  aspect-ratio: 1;
  justify-self: center;
  margin-right: 0;
}

.space-section {
  padding: 14vh var(--page-padding) 0;
}

.space-title {
  margin: 0;
  font-size: clamp(28px, 3.3vw, 46px);
  font-weight: 400;
  line-height: 1;
}

.section-title {
  margin: 0;
  font-size: clamp(28px, 3.3vw, 46px);
  font-weight: 400;
  line-height: 1;
}

.space-layout {
  padding-top: 8vh;
}

.space-grid {
  display: grid;
  grid-template-columns: minmax(320px, 1fr) minmax(280px, 360px);
  gap: 40px;
  align-items: start;
  margin-top: 5vh;
}

.space-map-card {
  background-color: rgb(255 255 255 / 6%);
  border: 1px solid rgb(255 255 255 / 15%);
  padding: 28px;
  border-radius: 18px;
}

.space-map-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  color: rgb(255 255 255 / 0.9);
  font-family: "Roboto Mono", monospace;
}

.space-map-header small {
  color: rgb(255 255 255 / 0.65);
  font-size: 12px;
  text-transform: none;
}

.active-map-button {
  text-decoration: underline;
}

.space-map {
  width: 100%;
  aspect-ratio: 5 / 4;
  border-radius: 16px;
  overflow: hidden;
  display: block;
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
}

.map-background {
  fill: transparent;
}

.map-area {
  fill: rgba(255,255,255,0.04);
  stroke: rgba(255,255,255,0.18);
  stroke-width: 2;
  cursor: pointer;
  transition: fill 180ms ease, stroke 180ms ease, filter 180ms ease;
}

.map-area-hover {
  fill: rgba(255,255,255,0.16);
}

.map-area-active {
  fill: rgba(255,255,255,0.25);
  stroke: rgba(255,255,255,0.95);
  filter: drop-shadow(0 0 18px rgba(255, 255, 255, 0.15));
}

.svg-area-hover {
  fill: rgba(255,255,255,0.16) !important;
  stroke: rgba(255,255,255,0.85) !important;
}

.svg-area-active {
  fill: rgba(255,255,255,0.28) !important;
  stroke: rgba(255,255,255,0.98) !important;
  filter: drop-shadow(0 0 22px rgba(255,255,255,0.18));
}

.map-label {
  font-family: "Roboto Mono", monospace;
  font-size: 22px;
  fill: rgba(255,255,255,0.9);
  pointer-events: none;
}

.map-label,
.space-list,
.space-button {
  font-weight: 400;
}

.map-hint {
  margin-top: 18px;
  color: rgb(255 255 255 / 0.6);
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  line-height: 1.4;
}

.space-list {
  display: grid;
  gap: 34px;
  margin: 0;
  padding-left: 0;
  list-style: none;
  font-family: "Roboto Mono", monospace;
  font-size: 19px;
  line-height: 1.25;
  letter-spacing: 0;
}

.space-button {
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font: inherit;
  padding: 0;
  text-align: left;
  text-transform: uppercase;
}

.space-button:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.space-description {
  max-width: 360px;
  margin: 14px 0 0;
  padding-left: 40px;
  color: white;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  line-height: 1.25;
  letter-spacing: 0;
  text-transform: none;
}

.faq-section {
  padding: 16vh var(--page-padding) 0;
}

.faq-list {
  display: grid;
  margin: 7vh 0 0;
  padding: 0;
  list-style: none;
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0;
}

.faq-item {
  border-bottom: 1px solid rgb(255 255 255 / 70%);
  padding: 28px 0;
}

.faq-item:first-child {
  border-top: 1px solid rgb(255 255 255 / 70%);
}

.faq-question {
  display: block;
  width: 100%;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font: inherit;
  font-size: 19px;
  line-height: 1.25;
  padding: 0;
  text-align: left;
  text-transform: uppercase;
}

.faq-question:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.faq-answer {
  max-width: 880px;
  margin: 34px 0 8px;
  font-size: 13px;
  line-height: 1.35;
  letter-spacing: 0;
  text-transform: none;
}

.rules-section {
  padding: 16vh var(--page-padding) 0;
}

.rules-list {
  display: grid;
  margin: 7vh 0 0;
  padding: 0;
  list-style: none;
  font-family: "Roboto Mono", monospace;
  letter-spacing: 0;
}

.rules-item {
  border-bottom: 1px solid rgb(255 255 255 / 70%);
  padding: 28px 0;
}

.rules-item:first-child {
  border-top: 1px solid rgb(255 255 255 / 70%);
}

.rules-question {
  display: block;
  width: 100%;
  border: 0;
  margin: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font: inherit;
  font-size: 19px;
  line-height: 1.25;
  padding: 0;
  text-align: left;
  text-transform: uppercase;
}

.rules-question:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.rules-answer {
  display: grid;
  gap: 14px;
  max-width: 1120px;
  margin: 34px 0 8px;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  line-height: 1.35;
  letter-spacing: 0;
  text-transform: none;
}

.rules-answer p {
  margin: 0;
}

@media (max-width: 760px) {
  .info-page {
    --page-padding: max(24px, 3vw);
    padding-bottom: 14vh;
  }

  .info-hero {
    min-height: 88vh;
  }

  .info-title {
    bottom: 32px;
    font-size: clamp(46px, 6.6vw, 90px);
  }

  .info-intro {
    padding-top: 4vh;
  }

  .info-intro br {
    display: none;
  }

  .info-intro p {
    max-width: 34rem;
    font-size: 11px;
    line-height: 1.45;
  }

  .info-balance {
    grid-template-columns: 1fr;
    gap: 28px;
    min-height: 0;
    margin-top: 8vh;
    padding-left: calc(var(--page-padding) + var(--balance-shift));
    padding-right: var(--page-padding);
  }

  .info-balance::before {
    display: none;
  }

  .info-balance::after {
    top: 50%;
    left: calc(var(--page-padding) + var(--balance-shift));
    right: var(--page-padding);
  }

  .balance-item {
    
    min-height: 180px;
  }

  .balance-item h2 {
    font-size: 13px;
  }

  .balance-item p {
    font-size: 13px;
  }

  .balance-item-music {
    padding-left: 20px;
  }

  .balance-item-thinking {
    padding-left: 20px;
  }

  .balance-circle-large,
  .balance-circle-small {
    width: min(54vw, 200px);
    margin-right: 0;
  }

  .space-section {
    padding-top: 10vh;
  }

  .space-layout {
    padding-top: 4vh;
  }

  .space-list {
    gap: 22px;
    font-size: 15px;
  }

  .space-description {
    padding-left: 18px;
    font-size: 13px;
  }

  .faq-question {
    font-size: 15px;
  }

  .faq-answer {
    font-size: 12px;
    margin-top: 24px;
  }

  .rules-question {
    font-size: 15px;
  }

  .rules-answer {
    font-size: 12px;
    margin-top: 24px;
  }
}
</style>
