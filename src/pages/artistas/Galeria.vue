<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from "vue";
import { RouterLink } from "vue-router";
import { Instagram, Music2, X } from "lucide-vue-next";
import { artists, type Artist } from "@/data/artists";

const selectedArtist = ref<Artist | null>(null);
const hoveredArtist = ref<string | null>(null);
const artistRowRefs = ref<(HTMLElement | null)[]>([]);
const artistRowScales = ref<number[]>([]);
const isModalOpen = computed(() => selectedArtist.value !== null);
const artistRows = computed(() => {
  const rows: Artist[][] = [];

  for (let index = 0; index < artists.length; index += 3) {
    rows.push(artists.slice(index, index + 3));
  }

  return rows;
});

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

const openArtist = (artist: Artist) => {
  selectedArtist.value = artist;
};

const setHoveredArtist = (artist: Artist | null) => {
  hoveredArtist.value = artist?.name ?? null;
};

const setArtistRowRef = (el: Element | ComponentPublicInstance | null, rowIndex: number) => {
  if (el instanceof HTMLElement) {
    artistRowRefs.value[rowIndex] = el;
  }
};

let rowAnimationFrame: number | null = null;

const updateArtistRowScales = () => {
  rowAnimationFrame = null;

  const viewportCenter = window.innerHeight / 2;
  const maxDistance = window.innerHeight * 0.65;

  artistRowScales.value = artistRowRefs.value.map((row) => {
    if (!row) {
      return 0.94;
    }

    const rect = row.getBoundingClientRect();
    const rowCenter = rect.top + rect.height / 2;
    const distance = Math.abs(rowCenter - viewportCenter);
    const proximity = clamp(1 - distance / maxDistance, 0, 1);

    return 0.92 + proximity * 0.16;
  });
};

const requestArtistRowScalesUpdate = () => {
  if (rowAnimationFrame !== null) {
    return;
  }

  rowAnimationFrame = window.requestAnimationFrame(updateArtistRowScales);
};

const closeArtist = () => {
  selectedArtist.value = null;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeArtist();
  }
};

watch(isModalOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("scroll", requestArtistRowScalesUpdate, { passive: true });
  window.addEventListener("resize", requestArtistRowScalesUpdate);
  nextTick(() => {
    updateArtistRowScales();
  });
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("scroll", requestArtistRowScalesUpdate);
  window.removeEventListener("resize", requestArtistRowScalesUpdate);
  if (rowAnimationFrame !== null) {
    window.cancelAnimationFrame(rowAnimationFrame);
  }
  document.body.style.overflow = "";
});
</script>

<template>
  <main class="artists-gallery-page">
    <header class="artists-gallery-header">
      <div>
        <h1 class="artists-gallery-title font-monument">GALERÍA</h1>
      </div>

      <RouterLink class="artists-gallery-back font-monument" to="/artistas#carrusel">
        VOLVER
      </RouterLink>
    </header>

    <section class="artists-gallery-stage">
      <section class="artists-grid" aria-label="Galería de artistas">
        <div
          v-for="(row, rowIndex) in artistRows"
          :key="rowIndex"
          class="artist-row"
          :ref="(el) => setArtistRowRef(el, rowIndex)"
          :style="{ transform: `scale(${artistRowScales[rowIndex] ?? 0.94})` }"
        >
          <button
            v-for="artist in row"
            :key="artist.name"
            type="button"
            class="artist-thumb"
            :class="{ 'artist-thumb--active': selectedArtist?.name === artist.name }"
            :aria-pressed="selectedArtist?.name === artist.name"
            :aria-label="`Abrir ficha de ${artist.name}`"
            @mouseenter="setHoveredArtist(artist)"
            @mouseleave="setHoveredArtist(null)"
            @focus="setHoveredArtist(artist)"
            @blur="setHoveredArtist(null)"
            @click="openArtist(artist)"
          >
            <img :src="artist.image" :alt="artist.name" class="artist-thumb-image" />
            <span
              class="artist-thumb-overlay"
              :class="{ 'artist-thumb-overlay--visible': hoveredArtist === artist.name }"
            >
              <span class="artist-thumb-overlay-gradient"></span>
              <span class="artist-thumb-overlay-name font-monument">
                {{ artist.name }}
              </span>
            </span>
          </button>
        </div>
      </section>

      <Transition name="modal-fade">
        <div
          v-if="isModalOpen && selectedArtist"
          class="artist-modal-backdrop"
          role="presentation"
          @click.self="closeArtist"
        >
          <article
            class="artist-modal"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="`artist-modal-title-${selectedArtist.name}`"
          >
            <button
              type="button"
              class="artist-modal-close"
              aria-label="Cerrar ficha del artista"
              @click="closeArtist"
            >
              <X :size="18" />
            </button>

            <div class="artist-modal-media">
              <img
                :src="selectedArtist.image"
                :alt="selectedArtist.name"
                class="artist-modal-image"
              />
            </div>

            <div class="artist-modal-copy">
              <p
                :id="`artist-modal-title-${selectedArtist.name}`"
                class="artist-modal-name font-monument"
              >
                {{ selectedArtist.name }}
              </p>

              <p class="artist-modal-text">
                {{
                  selectedArtist.bio ||
                  "Ficha pendiente de importar desde Excel. Cuando me pases la tabla, colocamos aquí la biografía o descripción."
                }}
              </p>

              <div class="artist-modal-links">
                <a
                  v-if="selectedArtist.instagramUrl"
                  :href="selectedArtist.instagramUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="artist-modal-link"
                  aria-label="Abrir Instagram"
                >
                  <Instagram :size="26" />
                </a>

                <a
                  v-if="selectedArtist.musicUrl"
                  :href="selectedArtist.musicUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="artist-modal-link"
                  aria-label="Abrir música del artista"
                >
                  <Music2 :size="26" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </Transition>
    </section>
  </main>
</template>

<style scoped>
.artists-gallery-page {
  min-height: 100vh;
  padding: 32px;
  background-color: #000;
  color: #fff;
}

.artists-gallery-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 56px;
}

.artists-gallery-title {
  margin: 0;
  font-size: clamp(42px, 6vw, 92px);
  line-height: 0.9;
  font-weight: 400;
}

.artists-gallery-back {
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-decoration: none;
  text-transform: uppercase;
  white-space: nowrap;
  margin-right: 24px;
}

.artists-gallery-back:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.artists-gallery-stage {
  display: grid;
  gap: 28px;
}

.artists-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-top: 8px;
  align-items: stretch;
}

.artist-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  padding-inline: 12px;
  box-sizing: border-box;
  transform-origin: center center;
  transition: transform 220ms ease;
  will-change: transform;
}

.artist-thumb {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  position: relative;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.artist-thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid rgb(255 255 255 / 10%);
  pointer-events: none;
  transition: border-color 180ms ease;
}

.artist-thumb:hover {
  transform: translateY(-2px);
}

.artist-thumb:hover::after,
.artist-thumb--active::after {
  border-color: rgb(255 255 255 / 34%);
}

.artist-thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.artist-thumb-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 180ms ease;
  pointer-events: none;
}

.artist-thumb-overlay--visible {
  opacity: 1;
}

.artist-thumb-overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 88%) 0%, rgb(0 0 0 / 42%) 44%, rgb(0 0 0 / 0%) 100%);
}

.artist-thumb-overlay-name {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 16px 16px 14px;
  font-size: 16px;
  letter-spacing: 0.2em;
  line-height: 1.1;
  text-transform: uppercase;
  text-align: left;
  color: #fff;
}

.artist-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgb(0 0 0 / 58%);
  backdrop-filter: blur(8px);
}

.artist-modal {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(280px, 0.58fr);
  gap: 72px;
  width: min(1060px, 100%);
  max-height: min(82vh, 820px);
  padding: 40px 44px;
  border: 1px solid rgb(255 255 255 / 12%);
  background: #000;
  box-shadow: 0 24px 80px rgb(0 0 0 / 55%);
}

.artist-modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  border: 0;
  background: transparent;
  color: #fff;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 160ms ease, opacity 160ms ease;
  z-index: 2;
}

.artist-modal-close:hover {
  transform: translateY(-1px);
  opacity: 0.8;
}

.artist-modal-media {
  overflow: hidden;
  align-self: stretch;
  min-height: 0;
  background: rgb(255 255 255 / 4%);
  aspect-ratio: 1 / 1;
  max-width: 620px;
}

.artist-modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.artist-modal-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
  padding: 18px 8px 18px 0;
}

.artist-modal-name {
  margin: 0;
  font-size: clamp(20px, 2.4vw, 34px);
  line-height: 0.92;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.artist-modal-text {
  margin: 0;
  max-width: 36ch;
  font-size: clamp(14px, 0.95vw, 16px);
  line-height: 1.55;
  color: rgb(255 255 255 / 82%);
}

.artist-modal-links {
  display: flex;
  gap: 18px;
  align-items: center;
}

.artist-modal-link {
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  box-shadow: none;
  transition: transform 160ms ease, opacity 160ms ease;
}

.artist-modal-link:hover {
  transform: translateY(-1px);
  opacity: 0.8;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 180ms ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1100px) {
  .artist-modal {
    grid-template-columns: 1fr;
    gap: 20px;
    max-height: 88vh;
    width: min(920px, 100%);
  }

  .artist-modal-media {
    max-width: none;
  }
}

@media (max-width: 760px) {
  .artists-gallery-page {
    padding: 20px 18px 28px;
  }

  .artists-gallery-header {
    margin-bottom: 28px;
  }

  .artists-gallery-back {
    margin-right: 12px;
  }

  .artists-gallery-title {
    font-size: clamp(36px, 14vw, 64px);
  }

  .artists-grid {
    gap: 12px;
  }

  .artist-row {
    gap: 12px;
    padding-inline: 0;
  }

  .artist-thumb-overlay-name {
    padding: 12px 10px 10px;
    font-size: 13px;
    letter-spacing: 0.16em;
  }

  .artist-modal-backdrop {
    padding: 10px;
  }

  .artist-modal {
    width: 100%;
    max-height: 92vh;
    padding: 16px;
    gap: 16px;
  }

  .artist-modal-copy {
    padding: 0;
    gap: 16px;
  }

  .artist-modal-name {
    padding-right: 44px;
    font-size: clamp(20px, 8vw, 28px);
  }

  .artist-modal-text {
    font-size: 14px;
  }

  .artist-modal-link {
    width: 28px;
    height: 28px;
  }
}
</style>
