<script setup lang="ts">

import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { useEmployeeStore } from '@/modules/projects/store/useEmployeeStore.ts'
import type { DateRange } from '@/types'
import { onMounted, ref } from 'vue'
import SideMenu from '@/modules/common/menus/SideMenu.vue'
import DateRangePicker from '@/modules/common/components/DateRangePicker.vue'
import StatCard from '@/modules/common/dashboard/StatCard.vue'
import DelayedTasksList from '@/modules/common/dashboard/DelayedTasksList.vue'
import ProjectsProgress from '@/modules/common/dashboard/ProjectsProgress.vue'

const projectStore = useProjectStore()
const employeeStore = useEmployeeStore()
const isLoading = ref(true)
const dateRange = ref<DateRange | null>(null)

// Load data on component mount
onMounted(async () => {
  try {
    await Promise.all([
      projectStore.fetchProjects(),
      employeeStore.fetchEmployees()
    ])
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})

// Update date filter
const updateDateFilter = (newRange: DateRange | null) => {
  dateRange.value = newRange
  projectStore.setDateFilter(newRange)
}

// Icons for stat cards
const icons = {
  projects: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
  employees: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  tasks: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  delayed: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
};

// Format percentage
const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <SideMenu />

    <div class="lg:pl-64 flex flex-col flex-1">
      <main class="flex-1 pb-8">
        <!-- Page header -->
        <div class="bg-white shadow">
          <div class="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
            <div class="py-6 md:flex md:items-center md:justify-between">
              <div class="flex-1 min-w-0">
                <h1 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Dashboard</h1>
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
            <!-- Statistics cards -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Proyectos"
                :value="projectStore.filteredProjects.length"
                :icon="icons.projects"
                color="bg-blue-500"
              />
              <StatCard
                title="Total Empleados"
                :value="employeeStore.employees.length"
                :icon="icons.employees"
                color="bg-Sky-500"
              />
              <StatCard
                title="Tareas Completadas"
                :value="formatPercentage(projectStore.taskStatistics.completionRate)"
                :icon="icons.tasks"
                color="bg-green-500"
              />
              <StatCard
                title="Tareas Retrasadas"
                :value="projectStore.taskStatistics.delayed"
                :icon="icons.delayed"
                color="bg-red-500"
              />
            </div>

            <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <!-- Delayed tasks list -->
              <DelayedTasksList :limit="5" />

              <!-- Projects progress -->
              <ProjectsProgress :limit="5" />
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>

</style>
