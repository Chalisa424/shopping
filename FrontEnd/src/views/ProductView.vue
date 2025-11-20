<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!--Title  -->
    <h1 class="mb-6 text-center text-white text-2xl font-bold text-slate-800 text-shadow-lg ">
      รายการสินค้าทั้งหมด
    </h1>

    <!-- Search -->
    <div class="mb-6 ">
      <searchBar 
      v-model="search"
      placeholder="ค้นหาสินค้า"
      @search="handleSearchClick"
      />
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
import pokemonCard from "../components/pokemonCard.vue";
import SearchBar from "../components/searchBar.vue";
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
  if (!keyword) return pokemons.value
  return pokemons.value.filter((p) => 
  p.name.toLowerCase().includes(keyword));
});

const handleAddToCart = (p: PokemonModel) => {
  console.log("add to cart:", p.name);
};

const handleSearchClick = () =>{
    console.log('search click:', search.value)
}
</script>
