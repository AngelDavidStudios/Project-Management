<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DateRange } from '@/types'


const props = defineProps<{
  modelValue: DateRange | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DateRange | null): void
}>()

const startDate = ref(props.modelValue?.startDate || '')
const endDate = ref(props.modelValue?.endDate || '')

const resetDateRange = () => {
  startDate.value = ''
  endDate.value = ''
  emit('update:modelValue', null)
}

watch([startDate, endDate], ([newStartDate, newEndDate]) => {
  if (newStartDate && newEndDate) {
    emit('update:modelValue', {
      startDate: newStartDate,
      endDate: newEndDate
    });
  } else if (!newStartDate && !newEndDate) {
    emit('update:modelValue', null);
  }
});

</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
    <div class="flex flex-col flex-1">
      <label for="start-date" class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
      <input
        id="start-date"
        v-model="startDate"
        type="date"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
      />
    </div>
    <div class="flex flex-col flex-1">
      <label for="end-date" class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
      <input
        id="end-date"
        v-model="endDate"
        type="date"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
      />
    </div>
    <div class="flex items-end">
      <button
        @click="resetDateRange"
        class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 h-10"
      >
        Limpiar
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
