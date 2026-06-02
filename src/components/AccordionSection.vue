<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  title: string;
  body: string;
}>();

const isOpen = ref(false);

const toggle = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <section class="accordion-item">
    <button class="accordion-question" type="button" :aria-expanded="isOpen" @click="toggle">
      {{ title }}
    </button>

    <Transition name="accordion-fade">
      <div v-if="isOpen" class="accordion-answer-wrap">
        <p class="accordion-answer">
          {{ body }}
        </p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.accordion-item {
  border-bottom: 1px solid rgb(255 255 255 / 70%);
  padding: 28px 0;
}

.accordion-item:first-child {
  border-top: 1px solid rgb(255 255 255 / 70%);
}

.accordion-question {
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

.accordion-question:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}

.accordion-answer-wrap {
  overflow: hidden;
}

.accordion-answer {
  max-width: 880px;
  margin: 34px 0 8px;
  font-family: "Roboto Mono", monospace;
  font-size: 13px;
  line-height: 1.35;
  letter-spacing: 0;
  text-transform: none;
}

.accordion-fade-enter-active,
.accordion-fade-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.accordion-fade-enter-from,
.accordion-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 760px) {
  .accordion-item {
    padding: 20px 0;
  }

  .accordion-question {
    font-size: 15px;
  }

  .accordion-answer {
    font-size: 12px;
    margin-top: 24px;
  }
}
</style>
