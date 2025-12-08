<template>
  <div
    class="flex min-h-screen bg-color"
    :style="{ background: bgColor }"
  >
    <!-- Sidebar -->
    <AdminSidebar />

      <!-- Main Area -->
    <div class="flex-1 flex flex-col ml-64">
      <!-- Navbar ของ admin -->
      <AdminTopbar />

      <main class="flex-1 overflow-y-auto px-8 py-8 mt-16">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AdminSidebar from "../components/AdminSidebar.vue";
import AdminTopbar from "../components/AdminNavbar.vue";

const route = useRoute();

const bgColor = computed(
  () =>
    (route.meta.bgColor as string) ||
    "linear-gradient(135deg, #2563eb 0%, #ffde00 100%)"
);
</script>

<style scoped>
.bg-color {
  min-height: 100vh;
  background: linear-gradient(135deg, #2563eb 0%, #ffde00 100%);
}
</style>