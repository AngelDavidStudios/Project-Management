<script setup lang="ts">

import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { formatDate } from '../../../types/date.ts'
import StatusBadge from '@/modules/common/components/StatusBadge.vue'
import DelayIndicator from '@/modules/common/components/DelayIndicator.vue'

const router = useRouter();
const projectStore = useProjectStore();

const props = defineProps<{
  limit?: number;
}>();

const displayedTasks = computed(() => {
  const tasks = projectStore.delayedTasks;
  if (props.limit && tasks.length > props.limit) {
    return tasks.slice(0, props.limit);
  }
  return tasks;
});

const goToProjectTasks = (projectId: string) => {
  router.push(`/projects/${projectId}/tasks`);
};

</script>

<template>
  <div class="bg-white shadow-sm rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Tareas Retrasadas</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Listado de tareas que están fuera de fecha límite.</p>
    </div>

    <div v-if="displayedTasks.length === 0" class="p-6 text-center text-gray-500">
      No hay tareas retrasadas. ¡Buen trabajo!
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarea</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Límite</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retraso</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in displayedTasks" :key="item.task.id" class="hover:bg-gray-50 cursor-pointer" @click="goToProjectTasks(item.projectId)">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ item.projectName }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.task.titulo }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <StatusBadge :status="item.task.estado" />
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(item.task.fechaLimite) }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <DelayIndicator :days="item.delay" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>
