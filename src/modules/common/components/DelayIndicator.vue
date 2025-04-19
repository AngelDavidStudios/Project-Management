<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  days: number;
}>();

// Compute the severity class based on the number of days
const severityClass = computed(() => {
  if (props.days <= 0) return 'text-green-500';
  if (props.days <= 3) return 'text-amber-500';
  if (props.days <= 7) return 'text-orange-500';
  return 'text-red-500';
})

// Get a descriptive text for the delay
const delayText = computed(() => {
  if (props.days <= 0) return 'A tiempo';
  if (props.days === 1) return '1 día de retraso';
  return `${props.days} días de retraso`;
})

</script>

<template>
  <div class="flex items-center">
    <span :class="severityClass" class="font-medium">
      {{ delayText }}
    </span>
  </div>
</template>

<style scoped>

</style>
