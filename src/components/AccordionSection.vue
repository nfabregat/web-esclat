<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  title: string;
  body: string;
  variant?: "default" | "info";
  isOpen?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
}>();

const isOpen = ref(false);
const isControlled = computed(() => props.isOpen !== undefined);
const active = computed(() => props.isOpen ?? isOpen.value);
const isInfoVariant = computed(() => props.variant === "info");

const toggle = () => {
  if (isControlled.value) {
    emit("toggle");
    return;
  }

  isOpen.value = !isOpen.value;
};
</script>

<template>
  <section class="accordion-item" :class="{ 'is-info': isInfoVariant }">
    <button class="accordion-question" type="button" :aria-expanded="active" @click="toggle">
      {{ title }}
    </button>

    <Transition name="accordion-fade">
      <div v-if="active" class="accordion-answer-wrap">
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
  padding: 18px 0;
}

.accordion-item:first-child {
  border-top: 1px solid rgb(255 255 255 / 70%);
}

.accordion-item.is-info {
  padding: 28px 0;
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
  font-size: 14px;
  line-height: 1.05;
  letter-spacing: 0.08em;
  padding: 0;
  text-align: left;
  text-transform: uppercase;
}

.accordion-item.is-info .accordion-question {
  font-size: 19px;
  line-height: 1.25;
  letter-spacing: 0;
}

.accordion-question:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.accordion-item.is-info .accordion-question:hover {
  text-underline-offset: 5px;
}

.accordion-answer-wrap {
  overflow: hidden;
}

.accordion-answer {
  max-width: 880px;
  margin: 18px 0 4px;
  font-family: "Roboto Mono", monospace;
  font-size: 12px;
  line-height: 1.35;
  letter-spacing: 0;
  text-transform: none;
}

.accordion-item.is-info .accordion-answer {
  max-width: 1120px;
  margin: 34px 0 8px;
  font-size: 13px;
  line-height: 1.35;
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
    padding: 16px 0;
  }

  .accordion-item.is-info {
    padding: 28px 0;
  }

  .accordion-question {
    font-size: 13px;
  }

  .accordion-item.is-info .accordion-question {
    font-size: 15px;
  }

  .accordion-answer {
    font-size: 12px;
    margin-top: 16px;
  }

  .accordion-item.is-info .accordion-answer {
    font-size: 12px;
    margin-top: 24px;
  }
}
</style>
