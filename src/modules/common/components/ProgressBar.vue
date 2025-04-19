<script setup lang="ts">

import { computed } from 'vue'

const props = defineProps<{
  value: number;
  max: number;
  label?: string;
}>();

const percentage = props.max > 0 ? Math.round((props.value / props.max) * 100) : 0;


const colorClass = computed(() => {
  if (percentage < 25) return 'bg-red-500';
  if (percentage < 50) return 'bg-amber-500';
  if (percentage < 75) return 'bg-blue-500';
  return 'bg-green-500';
})

</script>

<template>
  <div class="w-full">
    <div v-if="label" class="flex justify-between mb-1">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span class="text-sm font-medium text-gray-700">{{ percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div
        class="h-2.5 rounded-full"
        :class="colorClass"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<style scoped>

</style>
