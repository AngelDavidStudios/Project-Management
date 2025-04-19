<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'
import { useEmployeeStore } from '@/modules/projects/store/useEmployeeStore.ts'
import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { ref, computed, onMounted } from 'vue'
import type { Employee } from '@/types'

const router = useRouter();
const route = useRoute();
const employeeStore = useEmployeeStore();
const projectStore = useProjectStore();

const isLoading = ref(true);
const isSaving = ref(false);
const error = ref<string | null>(null);

const formData = ref<Partial<Employee>>({
  id: '',
  nombre: '',
  correo: '',
  proyectosAsignados: []
});

const isEditMode = computed(() => !!route.params.id);
const pageTitle = computed(() => isEditMode.value ? 'Editar Empleado' : 'Nuevo Empleado');
const buttonText = computed(() => isEditMode.value ? 'Guardar Cambios' : 'Crear Empleado');

onMounted(async () => {
  try {
    await projectStore.fetchProjects();

    if (isEditMode.value) {
      const employeeId = route.params.id as string;
      await employeeStore.fetchEmployeeByIdAsync(employeeId);

      if (employeeStore.currentEmployee) {
        formData.value = { ...employeeStore.currentEmployee };
      } else {
        error.value = 'No se encontró el empleado';
        router.replace({ name: 'EmployeeList' })
      }
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar datos';
    console.error(error.value);
  } finally {
    isLoading.value = false;
  }
});

const saveEmployee = async () => {
  if (!formData.value.nombre || !formData.value.correo) {
    error.value = 'Por favor complete todos los campos requeridos';
    return;
  }

  error.value = null;
  isSaving.value = true;

  try {
    if (isEditMode.value && route.params.id) {
      await employeeStore.updateEmployeeAsync(route.params.id as string, formData.value);
    } else {
      await employeeStore.addEmployeeAsync(formData.value as Employee);
    }
    router.replace({ name: 'EmployeeList' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al guardar empleado';
    console.error(error.value);
  } finally {
    isSaving.value = false;
  }
};

const toggleProject = (projectId: string) => {
  if (!formData.value.proyectosAsignados) {
    formData.value.proyectosAsignados = [];
  }

  const index = formData.value.proyectosAsignados.indexOf(projectId);
  if (index === -1) {
    formData.value.proyectosAsignados.push(projectId);
  } else {
    formData.value.proyectosAsignados.splice(index, 1);
  }
};

const cancelForm = () => {
  router.replace({ name: 'EmployeeList' });
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
        <form @submit.prevent="saveEmployee" class="space-y-6">
          <div>
            <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              id="nombre"
              v-model="formData.nombre"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
              placeholder="Nombre completo"
              required
            />
          </div>

          <div>
            <label for="correo" class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input
              id="correo"
              v-model="formData.correo"
              type="email"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border px-3"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Proyectos Asignados</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                v-for="project in projectStore.projects"
                :key="project.id"
                class="relative flex items-start"
              >
                <div class="flex items-center h-5">
                  <input
                    :id="`project-${project.id}`"
                    type="checkbox"
                    :checked="formData.proyectosAsignados?.includes(project.id)"
                    @change="toggleProject(project.id)"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label :for="`project-${project.id}`" class="font-medium text-gray-700">{{ project.nombre }}</label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="cancelForm"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
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
