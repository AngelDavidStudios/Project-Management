<script setup lang="ts">

import { useProjectStore } from '@/modules/projects/store/useProjectStore.ts'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { DateRange } from '@/types'

const projectStore = useProjectStore();
const router = useRouter();
const isLoading = ref(true);
const dateRange = ref<DateRange | null>(null);

</script>

<template>

</template>

<style scoped>

</style>
