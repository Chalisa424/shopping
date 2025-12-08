<template>
  <aside
    class="fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur border-r border-slate-200 flex flex-col shadow-sm"
  >
    <div class="flex items-center justify-center px-4 py-4 border-b border-slate-200 bg-white">
      <RouterLink to="/products" class="flex items-center gap-2">
        <img :src="logoSrc" alt="Pokemon Logo" class="h-10" />
      </RouterLink>
    </div>

    <!-- เมนู -->
    <nav class="flex-1 px-3 py-4 space-y-1 text-sm">
      <!-- การสั่งซื้อ -->
      <RouterLink
        :to="{ name: 'AdminOrderView' }"
        class="flex items-center gap-3 rounded-xl px-3 py-2 transition"
        :class="
          route.name === 'AdminOrderView'
            ? 'bg-emerald-500 text-white'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        "
      >
        <Icon icon="material-symbols:assignment" width="20" height="20" />
        <span>การสั่งซื้อ</span>
      </RouterLink>

      <!-- สินค้า -->
      <RouterLink
        :to="{ name: 'ProductView' }"
        class="flex items-center gap-3 rounded-xl px-3 py-2 transition"
        :class="
          route.name === 'ProductView'
            ? 'bg-emerald-500 text-white'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        "
      >
        <Icon icon="ix:product" width="20" height="20" />
        <span>สินค้า</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import Logo from "../assets/picture/logo.png";

const logoSrc = Logo;
const route = useRoute();
</script>
