<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  type ComponentPublicInstance,
} from "vue";

type MapCard = {
  id: "nivel1" | "nivel2" | "mutant";
  label: string;
  description: string;
  src: string;
  svg: string;
};

const mapCards = reactive<MapCard[]>([
  {
    id: "nivel1",
    label: "Planta Baja",
    description: "Nave principal, planta baja.",
    src: "/assets/mapa/Mapa-LASNAVES-Nivel1.svg",
    svg: "",
  },
  {
    id: "nivel2",
    label: "Planta 1",
    description: "Nave principal, planta 1.",
    src: "/assets/mapa/Mapa-LASNAVES-Nivel2.svg",
    svg: "",
  },
]);

const mainBuildingMaps = mapCards.slice(0, 2);
const mutantMap = reactive<MapCard>({
  id: "mutant",
  label: "La Mutant",
  description: "Nave 3.",
  src: "/assets/mapa/Mapa-LASNAVES-Mutant.svg",
  svg: "",
});

const activeFaq = ref<string | null>(null);
const activeRule = ref<string | null>(null);
const activeSpaceId = ref<string | null>(null);
const spaceGuideRefs = new Map<SpaceId, HTMLElement>();

const spaceDisplaySubtitles: Record<SpaceId, string> = {
  "space-01": "Planta baja",
  "space-02": "Planta baja",
  "space-03": "Planta 1",
  "space-04": "Planta 1",
  "space-05": "Planta baja",
  "space-06": "Planta baja",
  "space-07": "Planta baja",
  "space-08": "La Mutant",
  "space-09": "La Mutant",
};

const mapSpaceInfo = {
  "space-01": {
    title: "01. Hall La Polivalent",
    subtitle: "Hall y conexión",
    description:
      "Áreas de conexión entre espacios con ambientación visual, sonido e intervenciones artísticas. El hall articula la entrada y el flujo entre zonas del recinto.",
  },
  "space-02": {
    title: "02. La Polivalent",
    subtitle: "Workshop y experiencias",
    description:
      "Espacio dedicado a workshops, instalaciones inmersivas y experiencias interactivas relacionadas con arte, música y tecnología.",
  },
  "space-03": {
    title: "03. Factoría",
    subtitle: "Planta 1",
    description:
      "Zona de experimentación sonora y creación musical en directo.",
  },
  "space-04": {
    title: "04. Visual Room",
    subtitle: "Planta 1",
    description:
      "Sala centrada en visuales, luces, mapping y experiencias audiovisuales inmersivas.",
  },
  "space-05": {
    title: "05. Sala de Exposiciones",
    subtitle: "Planta baja",
    description:
      "Espacio dedicado a arte contemporáneo, instalaciones y colaboraciones visuales.",
  },
  "space-06": {
    title: "06. Patio 1",
    subtitle: "Planta baja",
    description:
      "Zona exterior pensada para descansar, socializar y desconectar entre actividades. Lugar donde se encuentra el confesionario.",
  },
  "space-07": {
    title: "07. Patio 2",
    subtitle: "Patio y performances",
    description:
      "Espacio dedicado a performances y arte urbano en vivo, incluyendo murales y acciones colectivas.",
  },
  "space-08": {
    title: "08. Vestíbulo La Mutant",
    subtitle: "La Mutant",
    description:
      "Área de conexión entre espacios con ambientación visual, sonido e intervenciones artísticas.",
  },
  "space-09": {
    title: "09. La Mutant",
    subtitle: "La Mutant",
    description:
      "El escenario principal del festival. Aquí tendrán lugar las sesiones más intensas, shows audiovisuales y directos principales.",
  },
} as const;

type SpaceId = keyof typeof mapSpaceInfo;

const spaceGuideItems = [
  { id: "space-01", label: "01. Hall La Polivalent" },
  { id: "space-02", label: "02. La Polivalent" },
  { id: "space-03", label: "03. Factoría" },
  { id: "space-04", label: "04. Visual Room" },
  { id: "space-05", label: "05. Sala de Exposiciones" },
  { id: "space-06", label: "06. Patio 1" },
  { id: "space-07", label: "07. Patio 2" },
  { id: "space-08", label: "08. Vestíbulo La Mutant" },
  { id: "space-09", label: "09. La Mutant" },
] as const satisfies ReadonlyArray<{ id: SpaceId; label: string }>;

const getSpaceSubtitle = (spaceId: SpaceId) => {
  return spaceDisplaySubtitles[spaceId];
};

const registerSpaceGuideRef =
  (spaceId: SpaceId) => (el: Element | ComponentPublicInstance | null) => {
  if (el instanceof HTMLElement) {
    spaceGuideRefs.set(spaceId, el);
  } else {
    spaceGuideRefs.delete(spaceId);
  }
};

const normalizeSvg = (id: MapCard["id"], svg: string) => {
  if (id !== "mutant") {
    return svg;
  }

  let normalized = svg;
  normalized = normalized.replace(
    /fill="#1d1d1b"/g,
    'fill="rgba(255,255,255,0.10)"'
  );
  normalized = normalized.replace(
    /stroke="#fff"/g,
    'stroke="#ffffff"'
  );

  return normalized;
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
    answer: "Sí. Algunas actividades tendrán plazas reducidas debido al espacio y al equipamiento técnico.",
  },
  {
    question: "¿HABRÁ COMIDA Y BEBIDA?",
    answer: "Sí. El recinto contará con zonas habilitadas de comida y bebida durante todo el festival.",
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

const toggleFaq = (question: string) => {
  activeFaq.value = activeFaq.value === question ? null : question;
};

const toggleRule = (title: string) => {
  activeRule.value = activeRule.value === title ? null : title;
};

const closeSpaceGuide = () => {
  activeSpaceId.value = null;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Element | null;

  if (!target) {
    return;
  }

  if (
    target.closest(".space-guide") ||
    target.closest(".map-frame") ||
    target.closest('[id^="space-"]')
  ) {
    return;
  }

  closeSpaceGuide();
};

const loadMaps = async () => {
  const results = await Promise.all(
    [...mapCards, mutantMap].map(async (map) => {
      const response = await fetch(map.src);
      if (!response.ok) {
        throw new Error(`Failed to load ${map.id}: ${response.status} ${response.statusText}`);
      }

      return { id: map.id, svg: normalizeSvg(map.id, await response.text()) };
    })
  );

  for (const result of results) {
    const map = [...mapCards, mutantMap].find((item) => item.id === result.id);
    if (map) {
      map.svg = result.svg;
    }
  }
};

const handleMapClick = (event: MouseEvent) => {
  const target = event.target as Element | null;
  const spaceNode = target?.closest?.('[id^="space-"]') as SVGGElement | null;

  if (!spaceNode?.id) {
    return;
  }

  const rawSpaceId = spaceNode.getAttribute("data-name") ?? spaceNode.id;
  const spaceId = rawSpaceId === "space-09-2" ? "space-09" : (rawSpaceId as SpaceId);

  selectSpace(spaceId, true);
};

const selectSpace = (spaceId: SpaceId, scrollToItem = false) => {
  activeSpaceId.value = spaceId;

  if (scrollToItem) {
    nextTick(() => {
      const target = spaceGuideRefs.get(spaceId) ?? document.getElementById(spaceId);

      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);

  loadMaps().catch((error) => {
    console.error("Error loading SVG maps:", error);
  });
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<template>
  <main class="info-page">
    <section class="info-hero">
      <h1 class="info-title font-monument">INFORMACIÓN</h1>
    </section>

    <section class="info-intro">
      <p>
        ESCLAT transforma Les Naus en un universo inmersivo inspirado en las
        raves industriales europeas y la cultura underground. El recinto
        combina arquitectura industrial, luz, sonido y arte para crear una
        experiencia sensorial y futurista.
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

      <div class="space-layout">
        <div class="mutant-side-stack">
          <article v-if="mutantMap" class="map-card map-card-mutant">
            <div class="map-card-header">
              <h3>{{ mutantMap.label }}</h3>
              <p>{{ mutantMap.description }}</p>
            </div>

            <div class="map-frame" @click="handleMapClick">
              <div v-html="mutantMap.svg" class="map-svg"></div>
            </div>
          </article>

          <div class="space-guide">
            <p class="space-guide-title">Guía de espacios:</p>
            <ul class="space-guide-list">
              <li
                v-for="item in spaceGuideItems"
                :id="item.id"
                :key="item.id"
                class="space-guide-item"
                :ref="registerSpaceGuideRef(item.id)"
              >
                <button
                  type="button"
                  class="space-guide-button"
                  :class="{ active: activeSpaceId === item.id }"
                  :aria-expanded="activeSpaceId === item.id"
                  :aria-controls="`${item.id}-details`"
                  @click="selectSpace(item.id, true)"
                >
                  {{ item.label }}
                </button>
                <div
                  v-if="activeSpaceId === item.id"
                  :id="`${item.id}-details`"
                  class="space-guide-details"
                >
                  <p class="space-guide-subtitle">{{ getSpaceSubtitle(item.id) }}</p>
                  <p class="space-guide-description">
                    {{ mapSpaceInfo[item.id].description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="main-building-stack">
          <article
            v-for="map in mainBuildingMaps"
            :key="map.id"
            class="map-card map-card-main"
            :class="map.id === 'nivel1' ? 'map-card-nivel1' : 'map-card-nivel2'"
          >
            <div class="map-card-header">
              <h3>{{ map.label }}</h3>
              <p>{{ map.description }}</p>
            </div>

            <div class="map-frame" @click="handleMapClick">
              <div v-html="map.svg" class="map-svg"></div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <h2 class="section-title font-monument">DUDAS FRECUENTES</h2>

      <ul class="faq-list">
        <li v-for="item in faqItems" :key="item.question" class="faq-item">
          <button class="faq-question" type="button" @click="toggleFaq(item.question)">
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
        <li v-for="item in ruleItems" :key="item.title" class="rules-item">
          <button class="rules-question" type="button" @click="toggleRule(item.title)">
            {{ item.title }}
          </button>

          <div v-if="activeRule === item.title" class="rules-answer">
            <p v-for="line in item.lines" :key="line">
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
  display: grid;
  grid-template-columns: minmax(360px, 1fr) minmax(0, 1fr);
  gap: 28px;
  margin-top: 5vh;
  align-items: start;
}

.mutant-side-stack {
  display: grid;
  gap: 18px;
  align-content: start;
}

.main-building-stack {
  display: grid;
  gap: 8px;
  align-content: start;
}

.map-card {
  display: grid;
  gap: 16px;
  align-content: start;
  min-width: 0;
}

.map-card-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}

.map-card-header h3 {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
}

.map-card-header p {
  margin: 0;
  color: rgb(255 255 255 / 0.7);
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  line-height: 1.4;
  text-transform: none;
}

.map-frame {
  background: transparent;
  cursor: pointer;
}

.map-svg {
  width: 100%;
  height: 100%;
}

.map-svg :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}

.map-svg :deep(svg text) {
  text-transform: none;
}

.map-svg :deep(g[id^="space-"]) {
  cursor: pointer;
}

.map-svg :deep(g[id^="space-"]:hover path),
.map-svg :deep(g[id^="space-"]:hover polygon),
.map-svg :deep(g[id^="space-"]:hover rect),
.map-svg :deep(g[id^="space-"]:hover circle),
.map-svg :deep(g[id^="space-"]:hover polyline),
.map-svg :deep(g[id^="space-"]:hover line) {
  fill: rgba(255, 255, 255, 0.18) !important;
  stroke: rgba(255, 255, 255, 0.95) !important;
}

.map-card-main {
  justify-self: end;
  width: min(100%, 600px);
}

.map-card-nivel1 {
  width: min(100%, 600px);
}

.map-card-nivel2 {
  width: min(78%, 470px);
}

.map-card-mutant {
  width: min(100%, 520px);
  justify-self: start;
}

.space-guide {
  margin-top: 0;
  padding-top: 14px;
  border-top: 1px solid rgb(255 255 255 / 0.22);
}

.space-guide-title {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: 0;
  text-transform: none;
  color: rgb(255 255 255 / 0.72);
}

.space-guide-list {
  display: grid;
  gap: 10px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.space-guide-item {
  display: grid;
  gap: 10px;
  padding-bottom: 6px;
  scroll-margin-top: 120px;
}

.space-guide-button {
  border: 0;
  background: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 16px;
  line-height: 1.25;
  padding: 0;
  text-align: left;
  text-transform: none;
}

.space-guide-button:hover,
.space-guide-button.active {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.space-guide-details {
  display: grid;
  gap: 8px;
  padding-left: 14px;
  padding-top: 10px;
  border-left: 1px solid rgb(255 255 255 / 0.18);
  font-family: "Roboto Mono", monospace;
  text-transform: none;
  letter-spacing: 0;
}

.space-guide-subtitle {
  margin: 0;
  font-size: 12px;
  color: rgb(255 255 255 / 0.72);
}

.space-guide-description {
  margin: 0;
  font-size: 14px;
  line-height: 1.45;
  color: rgb(255 255 255 / 0.92);
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
    padding-left: var(--page-padding);
    padding-right: var(--page-padding);
  }

  .info-balance::before {
    display: none;
  }

  .info-balance::after {
    top: 50%;
    left: var(--page-padding);
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

  .balance-item-music,
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
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .mutant-side-stack {
    gap: 22px;
  }

  .main-building-stack {
    gap: 16px;
  }

  .map-card-mutant,
  .map-card-main {
    width: 100%;
  }

  .map-card-nivel2 {
    width: min(100%, 499px);
    justify-self: end;
  }

  .space-guide {
    margin-top: 6px;
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
