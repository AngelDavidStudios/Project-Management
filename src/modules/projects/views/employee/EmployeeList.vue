<script setup lang="ts">

import { useEmployeeStore } from '@/modules/projects/store/useEmployeeStore.ts'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'

const employeeStore = useEmployeeStore();
const router = useRouter();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await employeeStore.fetchEmployees();
  } catch (error) {
    console.error('Error loading employees:', error);
  } finally {
    isLoading.value = false;
  }
});

const goToNewEmployee = () => {
  router.push({name: 'EmployeeNew'});
};

const goToEditEmployee = (id: string) => {
  router.push({name: 'EmployeeEdit', params: { id }});
};

const confirmDelete = (id: string) => {
  employeeStore.confirmDelete(id)
};

</script>

<template>
  <!-- Page header -->
  <div class="bg-white shadow">
    <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
      <div class="py-6 md:flex md:items-center md:justify-between">
        <div class="flex-1 min-w-0">
          <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Empleados</h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button
            @click="goToNewEmployee"
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Nuevo Empleado
          </button>
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

    <div v-else>
      <!-- Employee list -->
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul v-if="employeeStore.employees.length" class="divide-y divide-gray-200">
          <li v-for="employee in employeeStore.employees" :key="employee.id">
            <div class="px-4 py-4 flex items-center sm:px-6">
              <div class="min-w-0 flex-1">
                <div class="flex items-center">
                  <div class="bg-gray-100 rounded-full p-2">
                    <svg class="h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h2 class="text-sm font-medium text-blue-600 truncate">{{ employee.nombre }}</h2>
                    <div class="mt-1 flex items-center text-sm text-gray-500">
                      <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <span class="truncate">{{ employee.correo }}</span>
                    </div>
                    <div class="mt-1 flex items-center text-sm text-gray-500">
                      <svg class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                      <span>{{ employee.proyectosAsignados ? employee.proyectosAsignados.length : 0 }} proyectos asignados</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="ml-5 flex-shrink-0 flex">
                <button
                  @click="goToEditEmployee(employee.id)"
                  class="mr-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Editar
                </button>
                <button
                  @click="confirmDelete(employee.id)"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Eliminar
                </button>
              </div>
            </div>
          </li>
        </ul>

        <div v-else class="px-4 py-12 text-center text-gray-500">
          No hay empleados registrados. Comience creando uno nuevo.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
