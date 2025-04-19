<script setup lang="ts">

const props = defineProps<{
  title: string;
  value: number | string;
  icon?: string;
  color?: string;
}>();

const bgColor = props.color || 'bg-blue-500';

</script>

<template>
  <div class="bg-white overflow-hidden shadow-sm rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="`${bgColor} rounded-md p-3`">
            <svg v-if="icon" class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon"></path>
            </svg>
          </div>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dt class="text-sm font-medium text-gray-500 truncate">
            {{ title }}
          </dt>
          <dd class="flex items-baseline">
            <div class="text-2xl font-semibold text-gray-900">
              {{ value }}
            </div>
          </dd>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
