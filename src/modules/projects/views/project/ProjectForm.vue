<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { useEmployeeStore } from '@/modules/projects/store/useEmployeeStore.ts'
import { ref, computed, onMounted } from 'vue'
import type { Project } from '@/types'

const router = useRouter();
const route = useRoute();
const projectStore = useProjectStore();
const employeeStore = useEmployeeStore();

const isLoading = ref(true);
const isSaving = ref(false);
const error = ref<string | null>(null);

defineProps<{
  id: string;
}>()


const formData = ref<Partial<Project>>({
  id: '',
  nombre: '',
  descripcion: '',
  fechaInicio: '',
  fechaFin: '',
  empleadosAsignados: [],
  tareas: []
})

const isEditMode = computed(() => !!route.params.id);
const pageTitle = computed(() => isEditMode.value ? 'Editar Proyecto' : 'Nuevo Proyecto');
const buttonText = computed(() => isEditMode.value ? 'Guardar Cambios' : 'Crear Proyecto');

onMounted(async () => {
  try {
    await employeeStore.fetchEmployees();

    if (isEditMode.value) {
      const projectId = route.params.id as string;
      await projectStore.fetchProjectByIdAsync(projectId);

      if (projectStore.currentProject) {
        formData.value = { ...projectStore.currentProject };
      } else {
        error.value = 'No se encontró el proyecto';
        router.push({ name: 'ProjectList' });
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar datos';
    console.error(error.value);
  } finally {
    isLoading.value = false;
  }
});

const saveProject = async () => {
  if (!formData.value.nombre || !formData.value.fechaInicio || !formData.value.fechaFin) {
    error.value = 'Por favor complete todos los campos requeridos';
    return;
  }

  error.value = null;
  isSaving.value = true;

  try {
    if (isEditMode.value && route.params.id) {
      await projectStore.updateProjecyAsync(route.params.id as string, formData.value);
    } else {
      await projectStore.addProjectAsync(formData.value as Project);
    }
    router.push({ name: 'ProjectList' });
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar proyecto';
    console.error(error.value);
  } finally {
    isSaving.value = false;
  }
};

const toggleEmployee = (employeeId: string) => {
  if (!formData.value.empleadosAsignados) {
    formData.value.empleadosAsignados = [];
  }

  const index = formData.value.empleadosAsignados.indexOf(employeeId);
  if (index === -1) {
    formData.value.empleadosAsignados.push(employeeId);
  } else {
    formData.value.empleadosAsignados.splice(index, 1);
  }
};

const cancelForm = () => {
  router.replace({ name: 'ProjectList' });
};

</script>

<template>
  <!-- Page header -->
  <div class="bg-white shadow">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-6 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{{ pageTitle }}</h1>
        </div>
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

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <!-- Error message -->
      <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-400">
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

      <div class="p-6">
        <form @submit.prevent="saveProject" class="space-y-6">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
              placeholder="Nombre del proyecto"
              required />
          </div>

          <div>
            <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              id="descripcion"
              v-model="formData.descripcion"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-3"
              placeholder="Descripción del proyecto"></textarea>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label for="fechaInicio" class="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input
                id="fechaInicio"
                v-model="formData.fechaInicio"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
                required />
            </div>

            <div>
              <label for="fechaFin" class="block text-sm font-medium text-gray-700">Fecha de Fin</label>
              <input
                id="fechaFin"
                v-model="formData.fechaFin"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
                required />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Empleados Asignados</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="employee in employeeStore.employees"
                :key="employee.id"
                class="relative flex items-start">
                <div class="flex items-center h-5">
                  <input
                    :id="`employee-${employee.id}`"
                    type="checkbox"
                    :checked="formData.empleadosAsignados?.includes(employee.id)"
                    @change="toggleEmployee(employee.id)"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label :for="`employee-${employee.id}`" class="font-medium text-gray-700">{{ employee.nombre }}</label>
                  <p class="text-gray-500">{{ employee.correo }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="cancelForm"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              <svg v-if="isSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ buttonText }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
