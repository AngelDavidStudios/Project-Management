<script setup lang="ts">

import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import type { DateRange } from '@/types'
import { formatDate } from '@/types/date.ts'
import DateRangePicker from '@/modules/common/components/DateRangePicker.vue'

const projectStore = useProjectStore();
const router = useRouter();
const isLoading = ref(true);
const dateRange = ref<DateRange | null>(null);

defineProps<{
  id?: string;
}>()


onMounted(async () => {
  try {
    await projectStore.fetchProjects();
  } catch (error) {
    console.error('Error loading projects:', error);
  } finally {
    isLoading.value = false;
  }
});

const goToNewProject = () => {
  router.push({ name: 'ProjectNew'});
};

const goToEditProject = (id: string) => {
  router.push({ name: 'ProjectEdit', params: { id } });
};

const goToProjectTasks = (id: string) => {
  router.push(`/projects/${id}/tasks`);
};

// Date filtering
const updateDateFilter = (newRange: DateRange | null) => {
  dateRange.value = newRange;
  projectStore.setDateFilter(newRange);
};

// Calculate task completion for a project
const calculateCompletion = (projectId: string) => {
  const project = projectStore.getProjectById(projectId);
  if (!project || project.tareas.length === 0) return 0;

  const completedTasks = project.tareas.filter(task => task.estado === 2).length;
  const totalTasks = project.tareas.length;

  return Math.round((completedTasks / totalTasks) * 100);
};

const confirmDelete = (id: string) => {
  projectStore.confirmDelete(id)
};

</script>

<template>
  <!-- Page header -->
  <div class="bg-white shadow">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-6 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Proyectos</h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="goToNewProject"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Nuevo Proyecto
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8 px-4 sm:px-6 lg:px-8 lg:max-w-6xl lg:mx-auto">
    <!-- Date range filter -->
    <div class="mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-2">Filtrar por rango de fechas</h2>
      <DateRangePicker v-model="dateRange" @update:modelValue="updateDateFilter" />
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else>
      <!-- Project list -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul v-if="projectStore.filteredProjects.length > 0" class="divide-y divide-gray-200">
          <li v-for="project in projectStore.filteredProjects" :key="project.id">
            <div class="px-4 py-5 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="text-lg font-medium text-blue-600">{{ project.nombre }}</h3>
                  <p class="mt-1 text-sm text-gray-500">{{ project.descripcion }}</p>
                  <div class="mt-2 flex flex-wrap space-x-4">
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      {{ formatDate(project.fechaInicio) }} - {{ formatDate(project.fechaFin) }}
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      {{ project.empleadosAsignados.length }} empleados asignados
                    </div>
                    <div class="mt-2 flex items-center text-sm text-gray-500">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                      </svg>
                      {{ project.tareas.length }} tareas
                    </div>
                    <div class="mt-2 flex items-center text-sm">
                      <span class="mr-1.5 text-gray-500">Completado:</span>
                      <span class="font-medium" :class="{
                              'text-red-600': calculateCompletion(project.id) < 30,
                              'text-amber-600': calculateCompletion(project.id) >= 30 && calculateCompletion(project.id) < 70,
                              'text-green-600': calculateCompletion(project.id) >= 70
                            }">
                              {{ calculateCompletion(project.id) }}%
                            </span>
                    </div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="goToProjectTasks(project.id)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Ver Tareas
                  </button>
                  <button
                    @click="goToEditProject(project.id)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    @click="confirmDelete(project.id)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="px-4 py-12 text-center text-gray-500">
          No hay proyectos que coincidan con los criterios de búsqueda.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
