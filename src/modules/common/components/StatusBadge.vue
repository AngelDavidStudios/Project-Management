<script setup lang="ts">

defineProps<{
  status: number;
}>()

const statusClass = {
  0: 'bg-amber-100 text-amber-800', // Pending
  1: 'bg-blue-100 text-blue-800',   // In Progress
  2: 'bg-green-100 text-green-800', // Completed
  3: 'bg-red-100 text-red-800',     // Canceled
};

// Define the status labels
const statusLabel = {
  0: 'Pendiente',
  1: 'En Progreso',
  2: 'Completada',
  3: 'Retrasada',
};

</script>

<template>
    <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="statusClass[status as keyof typeof statusClass]"
    >
    {{ statusLabel[status as keyof typeof statusLabel] }}
  </span>
</template>

<style scoped>

</style>
