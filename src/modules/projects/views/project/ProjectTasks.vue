<script setup lang="ts">

import { useRoute } from 'vue-router'
import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { computed, onMounted, ref } from 'vue'
import type { Task } from '@/types'
import { calculateDelay, formatDate } from '@/types/date.ts'
import StatusBadge from '@/modules/common/components/StatusBadge.vue'
import DelayIndicator from '@/modules/common/components/DelayIndicator.vue'

const route = useRoute();
const projectStore = useProjectStore();

defineProps<{
  id: string;
}>()

const projectId = route.params.id as string;
const taskForm = ref<Partial<Task>>({})
const isLoading = ref(true);
const error = ref<string | null>(null);
const showTaskModal = ref(false);
const showDeleteModal = ref(false);
const taskToDelete = ref<string | null>(null);
const isEditingTask = ref(false);
const project = computed(() => projectStore.getProjectById(projectId))

onMounted(async () => {
  if (projectId) {
    try {
      await projectStore.fetchProjectByIdAsync(projectId);
      await projectStore.fetchAllTasksAsync(projectId);
      isLoading.value = false;
    } catch (err) {
      console.error('Error loading project or tasks:', err);
    }
  }
});

const sortedTasks = computed(() => {
  if (!project.value) return [];
  return [...project.value.tareas].sort((a, b) => {
    if (a.estado !== b.estado) return a.estado - b.estado;
    return new Date(a.fechaLimite).getTime() - new Date(b.fechaLimite).getTime();
  });
});

const openNewTaskModal = () => {
  isEditingTask.value = false;
  taskForm.value = {
    id: '',
    titulo: '',
    descripcion: '',
    fechaAsignada: new Date().toISOString().split('T')[0],
    fechaLimite: '',
    estado: 0
  };
  showTaskModal.value = true;
};

const openEditTaskModal = (task: Task) => {
  isEditingTask.value = true;
  taskForm.value = { ...task };
  showTaskModal.value = true;
};

const closeTaskModal = () => {
  showTaskModal.value = false
  taskForm.value = {}
}

const saveTask = async () => {
  if (!project.value) return;

  if (!taskForm.value.titulo || !taskForm.value.fechaAsignada || !taskForm.value.fechaLimite) {
    error.value = 'Por favor complete todos los campos requeridos';
    return;
  }

  try {
    taskForm.value.estado = Number(taskForm.value.estado);
    if (isEditingTask.value && taskForm.value.id) {
      await projectStore.updateTaskAsync(projectId, taskForm.value.id, taskForm.value)
    } else {
      await projectStore.addTaskAsync(projectId, taskForm.value as Task)
    }
    closeTaskModal();
    await projectStore.fetchProjectByIdAsync(projectId);
    await projectStore.fetchAllTasksAsync(projectId);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar la tarea';
    console.error(error.value);
  }
};

const confirmDeleteTask = (taskId: string) => {
  taskToDelete.value = taskId;
  showDeleteModal.value = true;
};

const cancelDeleteTask = () => {
  taskToDelete.value = null;
  showDeleteModal.value = false;
};

const executeDeleteTask = async () => {
  if (!project.value || !taskToDelete.value) return;

  try {
    await projectStore.deleteTaskAsync(project.value.id, taskToDelete.value);
    showDeleteModal.value = false;
    taskToDelete.value = null;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al eliminar la tarea';
    console.error(error.value);
  }
};

// Update task status
const updateTaskStatus = async (task: Task, newStatus: number) => {
  if (!project.value) return;

  try {
    await projectStore.updateTaskAsync(project.value.id, task.id, {
      ...task,
      estado: Number(newStatus)
    });
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al actualizar el estado de la tarea';
    console.error(error.value);
  }
};

</script>

<template>
  <!-- Page header -->
  <div class="bg-white shadow">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-6 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ project?.nombre }} - Tareas
          </h1>
          <p class="mt-1 text-sm text-gray-500">{{ project?.descripcion }}</p>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="openNewTaskModal"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nueva Tarea
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 px-4 sm:px-6 lg:px-8 lg:max-w-6xl lg:mx-auto">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-400">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- Task list -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div v-if="sortedTasks.length === 0" class="p-6 text-center text-gray-500">
            No hay tareas registradas. Comience creando una nueva tarea.
          </div>

          <ul v-else class="divide-y divide-gray-200">
            <li v-for="task in sortedTasks" :key="task.id" class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center">
                    <h3 class="text-lg font-medium text-gray-900">{{ task.titulo }}</h3>
                    <StatusBadge :status="task.estado ?? 0" class="ml-3" />
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{{ task.descripcion }}</p>
                  <div class="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div class="flex items-center">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      Asignada: {{ formatDate(task.fechaAsignada) }}
                    </div>
                    <div class="flex items-center">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Límite: {{ formatDate(task.fechaLimite) }}
                    </div>
                    <div v-if="task.estado !== 2 && calculateDelay(task.fechaLimite) > 0">
                      <DelayIndicator :days="calculateDelay(task.fechaLimite)" />
                    </div>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0 flex items-center space-x-2">
                  <select
                    v-model.number="task.estado"
                    @change="updateTaskStatus(task, parseInt(($event.target as HTMLSelectElement).value))"
                    class="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-9 border">
                    <option :value="0">Pendiente</option>
                    <option :value="1">En Progreso</option>
                    <option :value="2">Completada</option>
                    <option :value="3">Retrasada</option>
                  </select>
                  <button
                    @click="openEditTaskModal(task)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Editar
                  </button>
                  <button
                    @click="confirmDeleteTask(task.id)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <!-- Task modal -->
  <div v-if="showTaskModal" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 relative">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
            {{ isEditingTask ? 'Editar Tarea' : 'Nueva Tarea' }}
          </h3>
          <form @submit.prevent="saveTask" class="space-y-4">
            <div>
              <label for="titulo" class="block text-sm font-medium text-gray-700">Título</label>
              <input
                id="titulo"
                v-model="taskForm.titulo"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
                required
              />
            </div>

            <div>
              <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                id="descripcion"
                v-model="taskForm.descripcion"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-3"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label for="fechaAsignada" class="block text-sm font-medium text-gray-700">Fecha Asignada</label>
                <input
                  id="fechaAsignada"
                  v-model="taskForm.fechaAsignada"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
                  required
                />
              </div>

              <div>
                <label for="fechaLimite" class="block text-sm font-medium text-gray-700">Fecha Límite</label>
                <input
                  id="fechaLimite"
                  v-model="taskForm.fechaLimite"
                  type="date"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
                  required
                />
              </div>
            </div>

            <div>
              <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
              <select
                id="estado"
                v-model="taskForm.estado"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
              >
                <option value="0">Pendiente</option>
                <option value="1">En Progreso</option>
                <option value="2">Completada</option>
                <option value="3">Retrasada</option>
              </select>
            </div>
          </form>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="saveTask"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
            {{ isEditingTask ? 'Guardar Cambios' : 'Crear Tarea' }}

          </button>
          <button
            @click="closeTaskModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete confirmation modal -->
  <div v-if="showDeleteModal" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full z-50 relative">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Eliminar tarea</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  ¿Está seguro que desea eliminar esta tarea? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="executeDeleteTask"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Eliminar
          </button>
          <button
            @click="cancelDeleteTask"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
