<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!--Title  -->
    <h1 class="mb-6 text-center text-2xl font-bold text-slate-800">
      รายการสินค้าทั้งหมด
    </h1>

    <!-- Search -->
    <div class="mb-6 flex justify-center">
      <div class="relative w-full max-w-xl">
        <input
          v-model="search"
          type="text"
          placeholder="ค้นหาสินค้า"
          class="w-full rounded-full border border-slate-300 px-4 py-2.5 pl-12 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300"
          @click="console.log('Search:', search)"
        />
        <button 
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center
             h-8 w-9 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400
             shadow-md hover:opacity-90 transition"
        >
        <Icon
          icon="material-symbols:search-rounded"
          width="20"
          height="20"
          class="text-white"
        />
        </button>
      </div>
    </div>

    <!-- loading / error -->
    <div v-if="loading" class="py-10 text-center text-slate-500">
      กำลังโหลดสินค้า
    </div>
    <div v-else-if="error" class="py-10 text-center text-red-500 text-sm">
      {{ error }}
    </div>

    <!-- Grid -->
    <div v-else class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <pokemonCard
        v-for="item in filteredPokemons"
        :key="item.id"
        :pokemon="item"
        @add-to-cart="handleAddToCart"
      />
    </div>

    <!-- ไม่พบสินค้าที่ค้นหา -->
    <p
      v-if="!loading && filteredPokemons.length === 0"
      class="mt-10 text-center text-sm text-slate-500"
    >
      ไม่พบสินค้าที่ค้นหา
    </p>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import pokemonCard from "../components/pokemonCard.vue";
import { fetchPokemonPage } from "../services/pokemon.service";
import type { PokemonModel } from "../models/pokemon.model";
import { ref, computed, onMounted } from "vue";

const pokemons = ref<PokemonModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const search = ref("");

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    pokemons.value = await fetchPokemonPage(1, 12);
  } catch (e) {
    console.error(e);
    error.value = "ไม่สามารถโหลดรายการสินค้าได้";
  } finally {
    loading.value = false;
  }
});

const filteredPokemons = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return pokemons.value;
  return pokemons.value.filter((p) => p.name.toLowerCase().includes(keyword));
});

const handleAddToCart = (p: PokemonModel) => {
  console.log("add to cart:", p.name);
};
</script>
