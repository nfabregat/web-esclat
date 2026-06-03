<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  title: string;
  body: string;
  modelValue?: boolean;
}>();

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
}>();

const localIsOpen = ref(false);

const isControlled = computed(() => props.modelValue !== undefined);
const isOpen = computed(() => (isControlled.value ? props.modelValue ?? false : localIsOpen.value));

const toggle = () => {
  const nextValue = !isOpen.value;

  if (isControlled.value) {
    emit("update:modelValue", nextValue);
    return;
  }

  localIsOpen.value = nextValue;
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
  padding: 24px 0;
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
  font-size: 18px;
  line-height: 1.08;
  letter-spacing: 0.06em;
  padding: 0;
  text-align: left;
  text-transform: uppercase;
}

.accordion-question:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.accordion-answer-wrap {
  overflow: hidden;
}

.accordion-answer {
  max-width: 980px;
  margin: 22px 0 6px;
  font-family: "Roboto Mono", monospace;
  font-size: 15px;
  line-height: 1.45;
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
    font-size: 14px;
    margin-top: 18px;
  }
}
</style>
