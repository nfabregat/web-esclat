<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type ProgramFilter = "EVENTOS" | "ARTISTAS" | "TALLERES";
type ProgramItem =
  | string
  | {
      text: string;
      category: ProgramFilter;
    };
type ProgramDisplayItem = {
  key: string;
  title: string;
  times: string[];
  item: ProgramItem;
};

const programFilters: ProgramFilter[] = ["EVENTOS", "ARTISTAS", "TALLERES"];
const activeFilters = ref<Record<string, ProgramFilter | null>>({});
const isCompactLayout = ref(false);

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

const getItemCategory = (item: ProgramItem) => {
  return typeof item === "string" ? null : item.category;
};

const isItemHidden = (date: string, item: ProgramItem) => {
  const activeFilter = activeFilters.value[date];

  return (
    activeFilter !== null &&
    activeFilter !== undefined &&
    (typeof item === "string" || item.category !== activeFilter)
  );
};

const splitProgramText = (text: string) => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const time = lines[lines.length - 1] ?? "";
  const hasTime = /^\d{2}:\d{2}\s*-\s*\d{2}:\d{2}$/.test(time);
  const titleLines = hasTime ? lines.slice(0, -1) : lines;

  return {
    time: hasTime ? time.replace(/\s*-\s*/g, " - ") : "",
    title: titleLines.join("\n"),
  };
};

const getProgramDetails = (item: ProgramItem) => splitProgramText(getItemText(item));

const getProgramDisplayItems = (items: ProgramItem[]) => {
  if (!isCompactLayout.value) {
    return items.map<ProgramDisplayItem>((item, index) => {
      const details = getProgramDetails(item);

      return {
        key: `${getItemText(item)}-${index}`,
        title: details.title,
        times: details.time ? [details.time] : [],
        item,
      };
    });
  }

  const groupedItems: ProgramDisplayItem[] = [];

  for (const item of items) {
    const details = getProgramDetails(item);
    const itemCategory = getItemCategory(item);
    const previousItem = groupedItems[groupedItems.length - 1];

    if (
      previousItem &&
      previousItem.title === details.title &&
      getItemCategory(previousItem.item) === itemCategory
    ) {
      if (details.time) {
        previousItem.times.push(details.time);
      }
      continue;
    }

    groupedItems.push({
      key: `${details.title}-${groupedItems.length}`,
      title: details.title,
      times: details.time ? [details.time] : [],
      item,
    });
  }

  return groupedItems;
};

let compactMediaQuery: MediaQueryList | null = null;

const syncCompactLayout = () => {
  isCompactLayout.value = Boolean(compactMediaQuery?.matches);
};

onMounted(() => {
  compactMediaQuery = window.matchMedia("(max-width: 1024px)");
  syncCompactLayout();

  compactMediaQuery.addEventListener("change", syncCompactLayout);
});

onUnmounted(() => {
  compactMediaQuery?.removeEventListener("change", syncCompactLayout);
});

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
  <main class="program-page flex flex-col" @click="clearFilter">
    <section class="program-hero hidden md:block">
      <h1 class="program-title font-monument">PROGRAMA</h1>
    </section>

    <section v-for="day in programDays" :key="day.date" class="program-day flex flex-col">
      <div class="program-filters hidden md:flex">
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

      <div class="program-grid flex flex-col md:grid">
        <article v-for="column in day.columns" :key="column.space" class="program-column flex flex-col">
          <h3
            class="program-space-name"
            :class="{ 'program-space-name--single-line': column.space.includes('\n') }"
          >
            {{ column.space }}
          </h3>

          <div class="program-events">
            <p
              v-for="displayItem in getProgramDisplayItems(column.items)"
              :key="displayItem.key"
              class="program-event"
              :class="{ 'is-hidden': isItemHidden(day.date, displayItem.item), 'program-event--multiple-times': displayItem.times.length > 1 }"
            >
              <span class="program-event-time">
                <template v-if="displayItem.times.length > 0">
                  <span v-for="time in displayItem.times" :key="time" class="program-event-time-line">
                    {{ time }}
                  </span>
                </template>
                <span v-else class="program-event-time-line">&nbsp;</span>
              </span>
              <span class="program-event-title">{{ displayItem.title }}</span>
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

.program-day:last-child {
  padding-bottom: clamp(72px, 12vh, 140px);
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
  top: 90px;
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
  min-height: 34px;
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
  padding-top: 20px;
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

.program-event-title {
  display: block;
  white-space: pre-line;
}

.program-event-time {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 1024px) and (min-width: 761px) {
  .program-page {
    letter-spacing: 0.045em;
  }

  .program-hero {
    display: none;
  }

  .program-day {
    padding: 8px 18px 72px;
  }

  .program-filter {
    font-size: 15px;
    line-height: 1.1;
    margin-top: 18px;
  }

  .program-date {
    margin: 0 0 28px;
    font-size: clamp(26px, 8vw, 28px);
  }

  .program-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 58px;
    row-gap: 34px;
    min-height: auto;
    padding-top: 0;
    margin-left: 18px;
  }

  .program-grid::before {
    display: none;
  }

  .program-space-name {
    position: relative;
    margin: 0 0 35px 0;
    padding-bottom: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.05;
    border-bottom: none;
  }

  .program-column:nth-child(odd) .program-space-name::after {
    content: "";
    position: absolute;
    left: 0;
    right: calc(-100% - 58px);
    bottom: -8px;
    height: 1px;
    background-color: #8a8a8a;
    transform: scaleY(0.5);
    transform-origin: bottom;
  }

  .program-column:nth-child(even) .program-space-name::after {
    display: none;
  }

  .program-column {
    margin-bottom: 20px;
    padding: 0;
    border: none;
    margin-top: 12px;
  }

  .program-column:first-child {
    margin-top: 0;
  }

  .program-column:last-child {
    margin-bottom: 0;
  }

  .program-space-name--single-line {
    white-space: nowrap;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.03em;
  }

  .program-events {
    gap: 0;
    padding-top: 0;
  }

  .program-event {
    display: flex;
    gap: 70px;
    align-items: start;
    padding: 0;
    font-size: 12px;
    line-height: 1.05;
    margin-bottom: 8px;
  }

  .program-event:last-child {
    margin-bottom: 0;
  }

  .program-event--multiple-times {
    margin-bottom: 12px;
  }

  .program-event-time {
    flex: 0 0 112px;
    width: 112px;
    margin-top: 0;
    margin-left: 8px;
    white-space: nowrap;
    text-align: left;
    align-self: start;
    line-height: 1;
    font-size: 11px;
  }

  .program-event-time-line {
    display: block;
    white-space: nowrap;
  }

  .program-event-time-line:not(:first-child) {
    margin-top: 2px;
  }

  .program-event-title {
    min-width: 0;
    white-space: pre-line;
    text-align: left;
    line-height: 1.05;
  }
}

@media (max-width: 760px) {
  .program-page {
    letter-spacing: 0.045em;
  }

  .program-hero {
    display: none;
  }

  .program-day {
    padding: 8px 18px 72px;
  }

  .program-filter {
    font-size: 15px;
    line-height: 1.1;
    margin-top: 18px;
  }

  .program-date {
    margin: 0 0 28px;
    font-size: clamp(26px, 8vw, 28px);
  }

  .program-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    min-height: auto;
    padding-top: 0;
    margin-left: 18px;
  }

  .program-grid::before {
    display: none;
  }

  .program-column {
    margin-bottom: 20px;
    padding: 0;
    border: none;
    margin-top: 12px;
  }

  .program-column:first-child {
    margin-top: 0;
  }

  .program-column:last-child {
    margin-bottom: 0;
  }

  .program-space-name {
    position: relative;
    margin: 0 0 35px 0;
    padding-bottom: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.05;
    border-bottom: none;
  }

  .program-space-name::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -8px;
    height: 1px;
    background-color: #8a8a8a;
    transform: scaleY(0.5);
    transform-origin: bottom;
  }

  .program-space-name--single-line {
    white-space: nowrap;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.03em;
  }

  .program-events {
    gap: 0;
    padding-top: 0;
  }

  .program-event {
    display: flex;
    gap: 70px;
    align-items: start;
    padding: 0;
    font-size: 12px;
    line-height: 1.05;
    margin-bottom: 8px;
  }

  .program-event:last-child {
    margin-bottom: 0;
  }

  .program-event--multiple-times {
    margin-bottom: 12px;
  }

  .program-event-time {
    flex: 0 0 112px;
    width: 112px;
    margin-top: 0;
    margin-left: 8px;
    white-space: nowrap;
    text-align: left;
    align-self: start;
    line-height: 1;
    font-size: 11px;
  }

  .program-event-time-line {
    display: block;
    white-space: nowrap;
  }

  .program-event-time-line:not(:first-child) {
    margin-top: 2px;
  }

  .program-event-title {
    min-width: 0;
    white-space: pre-line;
    text-align: left;
    line-height: 1.05;
  }
}

</style>

