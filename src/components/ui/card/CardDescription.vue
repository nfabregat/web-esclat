<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <p
    data-slot="card-description"
    :class="cn('text-sm leading-relaxed text-white/60', props.class)"
  >
    <slot />
  </p>
</template>
