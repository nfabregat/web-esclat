<script setup lang="ts">
import { ref } from "vue";
import AccordionSection from "@/components/AccordionSection.vue";

type ActivityItem = {
  title: string;
  body: string;
};

const workshops: ActivityItem[] = [
  {
    title: "EXPERIENCIA TECNOLÓGICA EEG",
    body:
      "Sumérgete en una experiencia inmersiva donde la música y la tecnología se unen para revelar cómo reacciona tu cerebro ante el sonido. A través de dispositivos EEG y sistemas audiovisuales interactivos, tu actividad cerebral se transformará en visuales generados en tiempo real, creando una representación única de tus emociones y percepciones. Una instalación que convierte la relación entre mente, sonido y arte en una experiencia colectiva e inolvidable.",
  },
  {
    title: "CREA TU PROPIA MÚSICA CON DEFINIENDO STUDIO",
    body:
      "Descubre el proceso creativo detrás de la producción musical construyendo tu propia composición desde cero. Utilizando objetos cotidianos, materiales reutilizados, micrófonos y herramientas digitales, podrás experimentar con sonidos, ritmos y texturas para dar forma a una pieza única. Con la ayuda de productores y artistas invitados, transformarás tus ideas en una creación sonora que podrás llevarte contigo al finalizar la actividad.",
  },
  {
    title: "TU CUERPO COMO INSTRUMENTO",
    body:
      "¿Puede el cuerpo convertirse en un instrumento musical? En esta experiencia, tus propias pulsaciones serán el punto de partida para crear una composición electrónica original. Mediante sensores biométricos, el ritmo cardíaco se convertirá en sonido y se mezclará con sintetizadores, efectos y texturas electrónicas en tiempo real. Una propuesta que explora la conexión entre cuerpo, tecnología y música, convirtiendo cada participación en una pieza irrepetible.",
  },
  {
    title: "CONFESIONARIO",
    body:
      "Adéntrate en un espacio íntimo diseñado para compartir pensamientos, emociones y experiencias de forma completamente anónima. Durante los primeros días del festival, las voces de los asistentes serán recopiladas y transformadas en el material principal de una composición sonora colectiva. El resultado final se presentará durante la última jornada como una instalación audiovisual inmersiva que reflejará las emociones, historias y vivencias compartidas por la comunidad de ESCLAT.",
  },
  {
    title: "FOTOS ANALÓGICAS",
    body:
      "Redescubre la fotografía desde una mirada más pausada, física y experimental. A través de cámaras analógicas, los participantes podrán documentar distintos momentos del festival mientras aprenden conceptos básicos sobre composición, luz y técnicas fotográficas tradicionales. Además de capturar imágenes, la actividad permitirá conocer el proceso artesanal que existe detrás de cada fotografía, reivindicando el valor de la espera, el error y la creación manual en la era digital.",
  },
];

const events: ActivityItem[] = [
  {
    title: "PERFORMANCE HYPNOTICACOLECTIVA",
    body:
      "Una propuesta audiovisual inmersiva donde música electrónica, visuales generativos y movimiento se fusionan para crear un entorno hipnótico en constante transformación. Mediante ritmos envolventes, proyecciones sincronizadas y una puesta en escena cuidadosamente diseñada, la performance invita al público a sumergirse en una experiencia sensorial colectiva donde la percepción del tiempo y el espacio se difumina progresivamente.",
  },
  {
    title: "ARTE URBANO EN VIVO",
    body:
      "La creación artística sucede ante tus ojos. Durante esta intervención en directo, artistas especializados en street art y graffiti transformarán un gran mural colectivo mientras la música marca el ritmo de cada trazo. El resultado será una obra en constante evolución donde pintura, sonido y performance dialogan entre sí, reflejando la energía creativa y colaborativa que define la identidad de ESCLAT.",
  },
  {
    title: "PERFORMANCE ANDRÉS LACÁRCEL",
    body:
      "Moda, música y performance convergen en una experiencia escénica que va mucho más allá de una pasarela convencional. Bajo la dirección de Andrés Lacárcel, el desfile se convierte en un espectáculo vivo donde las prendas, el movimiento y la música construyen una narrativa visual de carácter experimental y futurista. Una propuesta que explora nuevas formas de expresión artística a través del cuerpo, la estética y la puesta en escena.",
  },
  {
    title: "TALK: IA Y PRODUCCIÓN MUSICAL",
    body:
      "La inteligencia artificial está redefiniendo la manera en que entendemos la creación musical. Esta charla explorará las posibilidades que ofrecen las nuevas tecnologías aplicadas al sonido, tomando como referencia el trabajo pionero de Holly Herndon. A través de ejemplos prácticos y casos reales, se abordarán cuestiones relacionadas con la creatividad algorítmica, la autoría y el futuro de la colaboración entre humanos y sistemas inteligentes.",
  },
  {
    title: "PERFORMANCE HYENAZ",
    body:
      "Hyenaz presenta una experiencia multidisciplinar donde música electrónica experimental, arte digital y performance se combinan para construir un universo visual y sonoro único. La propuesta explora temas relacionados con la identidad, la tecnología y los futuros posibles a través de una puesta en escena inmersiva que rompe las fronteras entre concierto, instalación artística y acción performativa.",
  },
  {
    title: "EXPOSICIÓN DE SINTETIZADORES Y SONIDOS ANALÓGICOS",
    body:
      "Un recorrido por la historia, evolución e impacto cultural de los sintetizadores que revolucionaron la música electrónica. La exposición reunirá instrumentos, dispositivos y estaciones interactivas que permitirán descubrir cómo se generan algunos de los sonidos más icónicos de las últimas décadas. Una oportunidad para acercarse a la dimensión más física y artesanal de la creación electrónica y experimentar de primera mano con las herramientas que han marcado generaciones de artistas y productores.",
  },
];

const activeWorkshop = ref<string | null>(null);
const activeEvent = ref<string | null>(null);

const setWorkshopOpen = (title: string, isOpen: boolean) => {
  activeWorkshop.value = isOpen ? title : null;
};

const setEventOpen = (title: string, isOpen: boolean) => {
  activeEvent.value = isOpen ? title : null;
};
</script>

<template>
  <main class="activities-page">
    <section class="activities-hero">
      <h1 class="activities-title font-monument">ACTIVIDADES</h1>
    </section>

    <section class="activities-section">
      <h2 class="activities-section-title font-monument">TALLERES</h2>

      <div class="activities-list">
        <AccordionSection
          v-for="item in workshops"
          :key="item.title"
          :title="item.title"
          :body="item.body"
          :model-value="activeWorkshop === item.title"
          @update:modelValue="setWorkshopOpen(item.title, $event)"
        />
      </div>
    </section>

    <section class="activities-section activities-section-events">
      <h2 class="activities-section-title font-monument">EVENTOS</h2>

      <div class="activities-list">
        <AccordionSection
          v-for="item in events"
          :key="item.title"
          :title="item.title"
          :body="item.body"
          :model-value="activeEvent === item.title"
          @update:modelValue="setEventOpen(item.title, $event)"
        />
      </div>
    </section>
  </main>
</template>

<style scoped>
.activities-page {
  min-height: 100vh;
  background-color: black;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
  padding-bottom: clamp(72px, 12vh, 140px);
}

.activities-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 88vh;
}

.activities-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: clamp(90px, 9vw, 140px);
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgb(0 0 0 / 0.78) 0%,
    rgb(0 0 0 / 0.48) 38%,
    rgb(0 0 0 / 0.16) 70%,
    rgb(0 0 0 / 0) 100%
  );
}

.activities-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    to right,
    rgb(0 0 0 / 0.42) 0%,
    rgb(0 0 0 / 0.18) 8%,
    rgb(0 0 0 / 0.04) 18%,
    rgb(0 0 0 / 0) 28%,
    rgb(0 0 0 / 0) 72%,
    rgb(0 0 0 / 0.04) 82%,
    rgb(0 0 0 / 0.18) 92%,
    rgb(0 0 0 / 0.42) 100%
  );
}

.activities-title {
  position: absolute;
  left: var(--page-padding);
  bottom: 32px;
  z-index: 1;
  margin: 0;
  font-size: clamp(46px, 6.6vw, 90px);
  font-weight: 400;
  line-height: 1;
}

.activities-section {
  padding: 9vh var(--page-padding) 0;
}

.activities-section-events {
  padding-top: 14vh;
}

.activities-section-title {
  margin: 0 0 36px;
  font-size: clamp(28px, 3.6vw, 46px);
  font-weight: 400;
  line-height: 1;
}

.activities-list {
  display: grid;
}

@media (max-width: 760px) {
  .activities-hero {
    min-height: 88vh;
  }

  .activities-hero::before {
    display: none;
  }

  .activities-hero::after {
    display: none;
  }

  .activities-title {
    font-size: clamp(34px, 9vw, 54px);
  }

  .activities-section {
    padding-top: 6vh;
  }

  .activities-section-events {
    padding-top: 12vh;
  }

  .activities-section-title {
    margin-bottom: 28px;
    font-size: clamp(24px, 7.2vw, 32px);
  }

  .activities-page :deep(.accordion-question) {
    font-size: 13px;
  }

  .activities-page :deep(.accordion-answer) {
    font-size: 11px;
    line-height: 1.4;
  }
}
</style>
