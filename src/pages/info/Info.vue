<script setup lang="ts">
import { ref } from "vue";

const festivalSpaces = [
  {
    name: "LA MUTANT",
    description:
      "El escenario principal del festival. Aquí tendrán lugar las sesiones más intensas, shows audiovisuales y directos principales.",
  },
  {
    name: "LA POLIVALENT",
    description:
      "Espacio dedicado a workshops, instalaciones inmersivas y experiencias interactivas relacionadas con arte, música y tecnología.",
  },
  {
    name: "FACTORÍA",
    description: "Zona de experimentación sonora y creación musical en directo.",
  },
  {
    name: "VISUAL ROOM",
    description:
      "Sala centrada en visuales, luces, mapping y experiencias audiovisuales inmersivas.",
  },
  {
    name: "SALA DE EXPOSICIONES",
    description:
      "Espacio dedicado a arte contemporáneo, instalaciones y colaboraciones visuales.",
  },
  {
    name: "PATIO 1",
    description:
      "Zona exterior pensada para descansar, socializar y desconectar entre actividades. Lugar donde se encuentra el confesionario.",
  },
  {
    name: "PATIO 2",
    description:
      "Espacio dedicado a performances y arte urbano en vivo, incluyendo murales y acciones colectivas.",
  },
  {
    name: "HALL Y VESTÍBULO",
    description:
      "Áreas de conexión entre espacios con ambientación visual, sonido e intervenciones artísticas.",
  },
];

const activeSpace = ref<string | null>(null);
const activeFaq = ref<string | null>(null);
const activeRule = ref<string | null>(null);

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

      <div class="space-layout">
        <ol class="space-list">
          <li
            v-for="(space, index) in festivalSpaces"
            :key="space.name"
            class="space-list-item"
          >
            <button
              class="space-button"
              type="button"
              @click="toggleSpace(space.name)"
            >
              {{ index + 1 }}. {{ space.name }}
            </button>

            <p v-if="activeSpace === space.name" class="space-description">
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
