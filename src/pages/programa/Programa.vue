<script setup lang="ts">
import { ref } from "vue";

type ProgramFilter = "EVENTOS" | "ARTISTAS" | "TALLERES";
type ProgramItem =
  | string
  | {
      text: string;
      category: ProgramFilter;
    };

const programFilters: ProgramFilter[] = ["EVENTOS", "ARTISTAS", "TALLERES"];
const activeFilters = ref<Record<string, ProgramFilter | null>>({});

const eventItem = (text: string): ProgramItem => ({ text, category: "EVENTOS" });
const artistItem = (text: string): ProgramItem => ({ text, category: "ARTISTAS" });
const workshopItem = (text: string): ProgramItem => ({ text, category: "TALLERES" });

const setFilter = (date: string, filter: ProgramFilter) => {
  activeFilters.value[date] = filter;
};

const clearFilter = () => {
  activeFilters.value = {};
};

const getItemText = (item: ProgramItem) => {
  return typeof item === "string" ? item : item.text;
};

const isItemHidden = (date: string, item: ProgramItem) => {
  const activeFilter = activeFilters.value[date];

  return (
    activeFilter !== null &&
    activeFilter !== undefined &&
    (typeof item === "string" || item.category !== activeFilter)
  );
};

const programDays = [
  {
    date: "23.10.26",
    columns: [
      {
        space: "LA POLIVALENT",
        items: [
          artistItem("DYSTORIZON\n18:00 - 19:00"),
          artistItem("MARINA HERLOP\n19:30 - 20:30"),
          artistItem("CATERINA BARBIERI\n21:00 - 22:30"),
          artistItem("ALESSANDRO CORTINI\n23:00 - 00:30"),
        ],
      },
      {
        space: "FACTORIA",
        items: [
          workshopItem("TALLER CREA TU\nPROPIA MÚSICA -\nDEFINIENDO STUDIO\n18:00 - 19:30"),
          workshopItem("TALLER CREA TU\nPROPIA MÚSICA -\nDEFINIENDO STUDIO\n20:30 - 22:00"),
        ],
      },
      {
        space: "VISUAL ROOM",
        items: [
          workshopItem("EXPERIENCIA\nTECNOLOGÍA EEG -\nBRAINRAVE\n18:00 - 22:30"),
        ],
      },
      {
        space: "SALA DE\nEXPOSICIONES",
        items: [
          eventItem("EXPOSICIÓN\nSINTETIZADORES Y\nSONIDOS\nANALÓGICOS -\nANALOGLOVE\n18:00 - 01:00"),
        ],
      },
      {
        space: "PATIO 1",
        items: [
          workshopItem("CONFESIONARIO -\nFOTOS ANALÓGICAS\n18:00 - 02:00"),
        ],
      },
      {
        space: "PATIO 2",
        items: [
          artistItem("ANALOGLOVE\n18:00 - 19:00"),
          eventItem("ARTE URBANO EN\nVIVO. 1º PARTE -\nJULIETA XLF,\nESCRIT\n19:30 - 20:30"),
          artistItem("DEFINIENDO AV\n21:00 - 22:00"),
          artistItem("SAMA_YAX\n22:30 - 23:30"),
        ],
      },
      {
        space: "LA MUTANT",
        items: [
          eventItem("PERFORMANCE\nHYPNOTICACOLECTIVA\n20:30 - 21:30"),
          artistItem("BATALLA DE DJS\nACIDNENA B2B\nARIETZZZ\n00:00 - 01:00"),
          artistItem("ARCA\n01:30 - 03:00"),
        ],
      },
    ],
  },
  {
    date: "24.10.26",
    columns: [
      {
        space: "LA POLIVALENT",
        items: [
          artistItem("NHITTO\n18:00 - 19:00"),
          artistItem("REEKO LIVE\n19:30 - 20:30"),
          artistItem("LANARK ARTEFAX\n21:00 - 22:00"),
          artistItem("LORENZO SENNI\n22:30 - 23:30"),
          artistItem("JASSS\n00:00 - 01:00"),
        ],
      },
      {
        space: "FACTORIA",
        items: [
          workshopItem("TALLER TU CUERPO\nCOMO INSTRUMENTO -\nRADIANTE LAB\n18:00 - 19:30"),
          workshopItem("TALLER TU CUERPO\nCOMO INSTRUMENTO -\nRADIANTE LAB\n20:30 - 22:00"),
        ],
      },
      {
        space: "VISUAL ROOM",
        items: [
          workshopItem("EXPERIENCIA\nTECNOLOGÍA EEG -\nBRAINRAVE\n18:00 - 22:30"),
        ],
      },
      {
        space: "SALA DE\nEXPOSICIONES",
        items: [
          eventItem("PASARELA -\nPERFORMANCE\nANDRÉS DE LA\nCÁRCEL- ARIEZZZ\n21:00 - 22:00"),
        ],
      },
      {
        space: "PATIO 1",
        items: [
          workshopItem("CONFESIONARIO -\nFOTOS ANALÓGICAS\n18:00 - 02:30"),
        ],
      },
      {
        space: "PATIO 2",
        items: [
          artistItem("LADRILLOVITZ\n18:00 - 19:00"),
          eventItem("ARTE URBANO EN\nVIVO. 2º PARTE -\nJULIETA XLF,\nESCRIF\n19:30 - 20:30"),
          artistItem("DAME AREA\n21:00 - 22:00"),
          artistItem("ORBE\n22:30 - 23:30"),
        ],
      },
      {
        space: "LA MUTANT",
        items: [
          artistItem("SKEE MASK\n00:00 - 01:00"),
          artistItem("RICARDO VILLALOBOS\n01:30 - 03:00"),
        ],
      },
    ],
  },
  {
    date: "25.10.26",
    columns: [
      {
        space: "LA POLIVALENT",
        items: [
          artistItem("RONE\n18:00 - 19:00"),
          artistItem("JLIN\n19:30 - 20:30"),
          artistItem("OBJEKT\n21:00 - 22:00"),
          artistItem("AISHA DEVI\n22:30 - 00:00"),
        ],
      },
      {
        space: "FACTORIA",
        items: [
          workshopItem("TALLER TU CUERPO\nCOMO INSTRUMENTO -\nRADIANTE LAB\n18:00 - 19:30"),
          workshopItem("TALLER TU CUERPO\nCOMO INSTRUMENTO -\nRADIANTE LAB\n20:30 - 22:00"),
        ],
      },
      {
        space: "VISUAL ROOM",
        items: [
          workshopItem("EXPERIENCIA\nTECNOLOGÍA EEG -\nBRAINRAVE\n18:00 - 22:30"),
        ],
      },
      {
        space: "SALA DE\nEXPOSICIONES",
        items: [
          eventItem("TALK USO DE IA EN\nLA PRODUCCIÓN DE\nHOLLY HERNDON\n21:00 - 22:00"),
        ],
      },
      {
        space: "PATIO 1",
        items: [
          workshopItem("CONFESIONARIO -\nFOTOS ANALÓGICAS\n18:00 - 02:30"),
        ],
      },
      {
        space: "PATIO 2",
        items: [
          artistItem("LUCAS CABELLO\n18:00 - 19:00"),
          eventItem("ARTE URBANO EN\nVIVO. 3º PARTE -\nJULIETA XLF,\nESCRIF\n19:30 - 20:30"),
          artistItem("TARTA RELENA\n21:00 - 22:00"),
          artistItem("ACIDNENA\n22:30 - 23:30"),
        ],
      },
      {
        space: "LA MUTANT",
        items: [
          eventItem("PERFORMANCE HYPENAZ\n20:30 - 21:30"),
          eventItem("PIEZA FINAL\nCONFESIONARIO\n23:00 - 23:30"),
          artistItem("AMNESIA SCANNER\n00:00 - 01:00"),
          artistItem("ALVA NOTO\n01:30 - 03:00"),
        ],
      },
    ],
  },
];

</script>

<template>
  <main class="program-page" @click="clearFilter">
    <section class="program-hero">
      <h1 class="program-title font-monument">PROGRAMA</h1>
    </section>

    <section v-for="day in programDays" :key="day.date" class="program-day">
      <div class="program-filters">
        <button
          v-for="filter in programFilters"
          :key="filter"
          class="program-filter"
          :class="{ 'is-active': activeFilters[day.date] === filter }"
          type="button"
          @click.stop="setFilter(day.date, filter)"
        >
          {{ filter }}
        </button>
      </div>

      <h2 class="program-date font-monument">{{ day.date }}</h2>

      <div class="program-grid">
        <article v-for="column in day.columns" :key="column.space" class="program-column">
          <h3 class="program-space-name">{{ column.space }}</h3>

          <div class="program-events">
            <p
              v-for="item in column.items"
              :key="getItemText(item)"
              class="program-event"
              :class="{ 'is-hidden': isItemHidden(day.date, item) }"
            >
              {{ getItemText(item) }}
            </p>
          </div>
        </article>
      </div>
    </section>

  </main>
</template>

<style scoped>
.program-page {
  min-height: 100vh;
  background-color: black;
  color: white;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  --page-padding: max(24px, 3vw);
}

.program-hero {
  position: relative;
  min-height: 88vh;
}

.program-title {
  position: absolute;
  left: var(--page-padding);
  bottom: 32px;
  font-size: clamp(46px, 6.6vw, 90px);
  font-weight: 400;
  line-height: 1;
}

.program-day {
  padding: 12vh calc(var(--page-padding) + 18px) 0;
}

.program-filters {
  display: flex;
  gap: 32px;
  margin-bottom: 38px;
}

.program-filter {
  border: 0;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-family: "Roboto Mono", monospace;
  font-size: 18px;
  padding: 0;
  text-underline-offset: 5px;
}

.program-filter:hover {
  text-decoration: underline;
}

.program-filter.is-active {
  text-decoration: underline;
}

.program-date {
  margin: 0;
  font-size: clamp(34px, 3.8vw, 52px);
  font-weight: 400;
  line-height: 1;
}

.program-grid {
  display: grid;
  position: relative;
  min-height: 46vh;
  width: 100%;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 18px;
  padding-top: 48px;
}

.program-grid::before {
  content: "";
  position: absolute;
  top: 96px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: white;
  transform: scaleY(0.5);
  transform-origin: top;
}

.program-column {
  min-width: 0;
  text-align: left;
}

.program-space-name {
  margin: 0;
  min-height: 36px;
  white-space: pre-line;
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.35;
}

.program-events {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 40px;
}

.program-event {
  margin: 0;
  white-space: pre-line;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.35;
  color: white;
  transition: color 160ms ease;
}

.program-event.is-hidden {
  color: black;
}

@media (max-width: 760px) {
  .program-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .program-filters {
    gap: 20px;
  }

}
</style>
