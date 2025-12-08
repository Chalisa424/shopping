<template>
  <nav
    class="fixed top-0 left-0 right-0 z-20 bg-white/80 py-1 backdrop-blur border-b border-slate-200"
  >
    <div class="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3">
      <!-- Logo -->
      <RouterLink to="/products" class="flex items-center gap-2">
        <img :src="logoSrc" alt="Pokemon Shop Logo" class="h-10" />
      </RouterLink>

      <!-- ปุ่มเมนูมือถือ -->
      <button
        type="button"
        class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
        @click="showMobileMenu = !showMobileMenu"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-width="2"
            d="M4 7h16M4 12h16M4 17h16"
          />
        </svg>
      </button>

      <!-- เมนูฝั่งขวา -->
      <div class="hidden items-center gap-4 md:flex">
        <!-- ปุ่มรถเข็น -->
        <button
          type="button"
          class="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow hover:bg-slate-50"
          @click="goCart"
        >
          <Icon icon="mdi:cart-outline" width="22" height="22" />
          <span
            v-if="cartCountComputed > 0"
            class="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white"
          >
            {{ cartCountComputed }}
          </span>
        </button>

        <!-- เมนูผู้ใช้ -->
        <div class="relative">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-slate-900"
            @click="toggleUserMenu"
          >
            <Icon icon="fluent:person-16-filled" width="18" height="18" />
          </button>

          <!-- Dropdown (desktop) -->
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-44 rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black/5"
          >
            <!-- รายการสินค้า -->
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
              @click="goListPokemon"
            >
              รายการสินค้า
            </button>

            <!-- รถเข็น -->
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
              @click="goCart"
            >
              รถเข็น
            </button>

            <!-- รายการสั่งซื้อของฉัน -->
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
              @click="goMyOrders"
            >
              รายการสั่งซื้อ
            </button>

            <hr class="my-1 border-slate-100" />

            <!-- Admin -->
            <button
              type="button"
              class="block w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50"
              @click="switchToAdmin"
            >
              Admin
            </button>

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
      </div>
    </div>

    <!-- เมนูมือถือ -->
    <div
      v-if="showMobileMenu"
      class="border-t border-slate-200 bg-white md:hidden"
    >
      <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3">
        <RouterLink
          to="/products"
          class="text-sm font-medium text-slate-700 hover:text-slate-900"
          @click="showMobileMenu = false"
        >
          สินค้าทั้งหมด
        </RouterLink>

        <!-- รายการสินค้า (mobile) -->
        <button
          type="button"
          class="flex items-center gap-2 text-sm text-slate-700"
          @click="goListPokemon"
        >
          <Icon icon="mdi:clipboard-list-outline" width="20" height="20" />
          รายการสินค้า
        </button>

        <!-- รายการสั่งซื้อของฉัน (mobile) -->
        <button
          type="button"
          class="flex items-center gap-2 text-sm text-slate-700"
          @click="goMyOrders"
        >
          <Icon icon="mdi:clipboard-list-outline" width="20" height="20" />
          รายการสั่งซื้อของฉัน
        </button>

        <!-- รถเข็น (mobile) -->
        <button
          type="button"
          class="flex items-center gap-2 text-sm text-slate-700"
          @click="goCart"
        >
          <Icon icon="mdi:cart-outline" width="20" height="20" />
          รถเข็น
          <span
            v-if="cartCountComputed > 0"
            class="ml-1 rounded-full bg-rose-500 px-2 text-[11px] font-semibold text-white"
          >
            {{ cartCountComputed }}
          </span>
        </button>

        <hr class="border-slate-200" />

        <button
          type="button"
          class="text-left text-sm text-slate-700"
          @click="switchToAdmin"
        >
          Admin
        </button>
        <button
          type="button"
          class="text-left text-sm text-rose-600"
          @click="handleLogout"
        >
          ออกจากระบบ
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { Icon } from "@iconify/vue";
import Logo from "../assets/picture/logo.png";
import { authStore } from "../stores/auth.store";

const props = withDefaults(
  defineProps<{
    cartCount?: number;
  }>(),
  {
    cartCount: 0,
  }
);

const router = useRouter();
const auth = authStore();

const logoSrc = Logo;
const showUserMenu = ref(false);
const showMobileMenu = ref(false);

const cartCountComputed = computed(() => props.cartCount ?? 0);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  auth.logout();
};

/** ไปหน้า Admin Login */
const switchToAdmin = () => {
  localStorage.setItem("preferredRole", "admin");
  showUserMenu.value = false;
  showMobileMenu.value = false;
  router.push({ name: "AdminLoginView" });
};

/** ไปหน้าแรก */
const goListPokemon = () => {
  showUserMenu.value = false;
  showMobileMenu.value = false;
  router.push({ name: "ProductView" });
};

/** ไปหน้า Cart */
const goCart = () => {
  showUserMenu.value = false;
  showMobileMenu.value = false;
  router.push({ name: "CartView" });
};

/** ไปหน้า รายการสั่งซื้อของฉัน */
const goMyOrders = () => {
  showUserMenu.value = false;
  showMobileMenu.value = false;
  router.push({ name: "MyOrdersView" });
};
</script>

