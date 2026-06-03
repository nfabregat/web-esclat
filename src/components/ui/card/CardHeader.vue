<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>

<template>
  <div
    data-slot="card-header"
    :class="cn('flex flex-col gap-1.5 p-5 pb-0', props.class)"
  >
    <slot />
  </div>
</template>
