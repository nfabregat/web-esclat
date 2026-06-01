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
    data-slot="card"
    :class="
      cn(
        'flex flex-col overflow-hidden border border-white/10 bg-white/[0.02] text-white shadow-sm transition-transform duration-200 ease-out',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
