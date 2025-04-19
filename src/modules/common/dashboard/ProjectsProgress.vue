<script setup lang="ts">
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { formatDate } from '../../../types/date.ts'
import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'

const router = useRouter();
const projectStore = useProjectStore();

const props = defineProps<{
  limit?: number;
}>();

const sortedProjects = computed(() => {
  return [...projectStore.projects]
    .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
    .slice(0, props.limit ?? projectStore.projects.length);
});

// Calculate completion percentage for a project
const calculateCompletion = (projectId: string) => {
  const project = projectStore.getProjectById(projectId);
  if (!project || project.tareas.length === 0) return 0;

  const completedTasks = project.tareas.filter(task => task.estado === 2).length;
  return completedTasks;
};

// Calculate total tasks for a project
const totalTasks = (projectId: string) => {
  const project = projectStore.getProjectById(projectId);
  return project?.tareas.length || 0;
};

// Navigate to project details
const goToProject = (projectId: string) => {
  router.push(`/projects/${projectId}`);
};

</script>

<template>
  <div class="bg-white shadow-sm rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Progreso de Proyectos</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">Visualización del avance de los proyectos actuales.</p>
    </div>

    <div v-if="sortedProjects.length === 0" class="p-6 text-center text-gray-500">
      No hay proyectos disponibles.
    </div>

    <div v-else class="p-4 divide-y divide-gray-200">
      <div
        v-for="project in sortedProjects"
        :key="project.id"
        class="py-4 cursor-pointer hover:bg-gray-50"
        @click="goToProject(project.id)"
      >
        <div class="flex justify-between mb-2">
          <h4 class="text-sm font-medium text-gray-900">{{ project.nombre }}</h4>
          <span class="text-xs text-gray-500">{{ formatDate(project.fechaInicio) }} - {{ formatDate(project.fechaFin) }}</span>
        </div>
        <ProgressBar
          :value="calculateCompletion(project.id)"
          :max="totalTasks(project.id)"
          :label="`${calculateCompletion(project.id)}/${totalTasks(project.id)} tareas completadas`"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
