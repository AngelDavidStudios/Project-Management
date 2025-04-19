<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter();
const route = useRoute();

const isMobileMenuOpen = ref(false);

const navItems = [
  { name: 'Dashboard', path: '/', icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25' },
  { name: 'Empleados', path: '/employees', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { name: 'Proyectos', path: '/projects', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
];

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const navigateTo = (path: string) => {
  router.push(path);
  isMobileMenuOpen.value = false;
};

</script>

<template>
  <div>
    <!-- Mobile menu button -->
    <div class="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 lg:hidden">
      <div class="flex items-center space-x-3">
        <button @click="toggleMobileMenu" class="text-gray-500 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path v-if="isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <span class="text-lg font-semibold text-gray-800">Project Management</span>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 z-20 flex lg:hidden">
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="toggleMobileMenu"></div>
      <div class="relative flex flex-col w-64 max-w-xs py-4 bg-white border-r border-gray-200">
        <div class="flex items-center justify-center px-4 mb-5">
          <span class="text-xl font-semibold text-gray-800">Project Management</span>
        </div>
        <nav class="flex-1 px-2 space-y-1">
          <a
            v-for="(item, index) in navItems"
            :key="index"
            @click="navigateTo(item.path)"
            class="flex items-center px-4 py-3 text-base font-medium rounded-md cursor-pointer transition-colors duration-150"
            :class="isActive(item.path) ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
          >
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
            </svg>
            {{ item.name }}
          </a>
        </nav>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div class="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
        <div class="flex items-center justify-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
          <span class="text-xl font-semibold text-gray-800">Project Management</span>
        </div>
        <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <nav class="flex-1 px-2 space-y-1">
            <a
              v-for="(item, index) in navItems"
              :key="index"
              @click="navigateTo(item.path)"
              class="flex items-center px-4 py-3 text-base font-medium rounded-md cursor-pointer transition-colors duration-150"
              :class="isActive(item.path) ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
              </svg>
              {{ item.name }}
            </a>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
