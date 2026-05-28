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

const collaboratorLogos = [
  { src: "/assets/logos/Ayuntament de Valencia.png", alt: "Ayuntament de Valencia" },
  { src: "/assets/logos/Las Naves.png", alt: "Las Naves" },
];

const organizerLogos = [
  { src: "/assets/logos/Diputacio de Valencia.png", alt: "Diputacio de Valencia" },
  { src: "/assets/logos/IVAJ.png", alt: "IVAJ" },
  { src: "/assets/logos/Turia.png", alt: "Turia" },
  { src: "/assets/logos/Cocacola.png", alt: "Cocacola" },
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

    <footer class="program-footer">
      <div class="footer-columns">
        <section>
          <p class="footer-label">COLABORA</p>
          <div class="footer-logos">
            <span class="footer-esclat font-monument">ESCLAT</span>
            <img
              v-for="logo in collaboratorLogos"
              :key="logo.src"
              :src="logo.src"
              :alt="logo.alt"
            />
          </div>
        </section>

        <section>
          <p class="footer-label">ORGANIZA</p>
          <div class="footer-logos">
            <img
              v-for="logo in organizerLogos"
              :key="logo.src"
              :src="logo.src"
              :alt="logo.alt"
            />
          </div>
        </section>
      </div>

      <div class="footer-divider"></div>

      <div class="footer-bottom">
        <p class="footer-legal">
          © 2026 ESCLAT FESTIVAL | TÉRMINOS Y CONDICIONES · AVISO LEGAL ·
          POLÍTICA DE PRIVACIDAD · POLÍTICA DE COOKIES
        </p>

        <nav class="footer-socials" aria-label="Redes sociales">
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="5"></rect>
              <circle cx="12" cy="12" r="4"></circle>
              <circle cx="17" cy="7" r="1"></circle>
            </svg>
          </a>
          <a href="#" aria-label="X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19"></path>
            </svg>
          </a>
          <a href="#" aria-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 6v10a3 3 0 1 1-3-3"></path>
              <path d="M10 6c2.5 3 4.5 4 7 4"></path>
            </svg>
          </a>
        </nav>
      </div>
    </footer>
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

.program-footer {
  background-color: black;
  padding: 13vh var(--page-padding) 26px;
}

.footer-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
}

.footer-label {
  margin: 0 0 22px;
  font-family: "Roboto Mono", monospace;
  color: white;
  font-size: 15px;
  line-height: 1;
}

.footer-logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

.footer-esclat {
  font-size: 18px;
  font-weight: 900;
  line-height: 1;
}

.footer-logos img {
  width: auto;
  max-height: 28px;
  filter: brightness(0) invert(1);
}

.footer-divider {
  height: 1px;
  margin: 44px 0 20px;
  background-color: rgb(255 255 255 / 18%);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.footer-legal {
  margin: 0;
  font-family: "Roboto Mono", monospace;
  color: white;
  font-size: 10px;
  line-height: 1.5;
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: 16px;
}

.footer-socials a {
  color: inherit;
}

.footer-socials svg {
  display: block;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: white;
  stroke-width: 1.7;
}

@media (max-width: 760px) {
  .program-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .program-filters {
    gap: 20px;
  }

  .footer-columns {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    display: grid;
  }
}
</style>
