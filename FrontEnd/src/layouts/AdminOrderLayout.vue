<template>
  <div
    class="flex min-h-screen bg-color"
    :style="{ background: bgColor }"
  >
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Area -->
    <div class="flex-1 flex flex-col ml-64">
      <!-- Topbar: fixed -->
      <header
        class="fixed top-0 left-64 right-0 z-20 h-18 flex items-center justify-end px-6 bg-white/70 backdrop-blur border-b border-slate-200"
      >
        <div class="relative">
          <!-- ปุ่ม avatar -->
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900"
            @click="toggleUserMenu"
          >
            <Icon icon="fluent:person-16-filled" width="18" height="18" />
          </button>

          <!-- Dropdown -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-44 rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
          >
            <div class="px-3 pb-1 pt-2 text-xs text-slate-400">
              เข้าสู่ระบบเป็น
              <span class="font-medium text-slate-700">Admin</span>
            </div>

            <!-- User -->
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
              @click="switchToUser"
            >
              User
            </button>

            <hr class="my-1 border-slate-100" />

            <!-- Logout -->
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50"
              @click="handleLogout"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto px-8 py-8 mt-16">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { authStore } from "../stores/auth.store";
import AdminSidebar from "../components/AdminSidebar.vue";

const router = useRouter();
const route = useRoute();
const auth = authStore();

const showUserMenu = ref(false);
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  showUserMenu.value = false;
  auth.logout();
  router.push({ name: "LoginView" });
};

const switchToUser = () => {
  localStorage.setItem("preferredRole", "admin");
  showUserMenu.value = false;
  router.push({ name: "LoginView" });
};

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
