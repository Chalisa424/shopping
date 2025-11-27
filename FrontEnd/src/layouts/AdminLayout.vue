<script setup lang="ts">
import {computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();

const bgColor = computed(
    () => (route.meta.bgColor as string) || '#2563EB'
)
</script>

<template>
  <div class="min-h-screen bg-color font-kanit text-sm flex items-center justify-center">
    <main class="w-full max-w-md">
        <router-view />
    </main>
  </div>  
</template>

<style scoped>
.bg-color {
    min-height: 100vh;
    background: linear-gradient(135deg, #2563eb 0%, #ffde00 100%);
}
</style>