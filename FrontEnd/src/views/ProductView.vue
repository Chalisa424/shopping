<template>
  <div class="mx-auto max-w-[80rem] px-4 py-8">
    <navbar :cart-count="cartCount" />

    <!--Title  -->
    <h1
      class="mt-20 mb-5 text-center text-white text-2xl font-bold text-slate-800 text-shadow-lg"
    >
      รายการสินค้าทั้งหมด
    </h1>

    <!-- Search -->
    <div class="mb-6">
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
    <div v-else class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <!-- {{ pokemons }} -->
      <pokemonCard
        v-for="item in filteredPokemons"
        :key="item.id"
        :pokemon="item"
        @add-to-cart="handleAddToCart"
      />
    </div>

    <!-- pagination -->
    <div class="mt-8 flex justify-center">
      <pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total-pages="totalPages"
        @change="handlePageChange"
      />
    </div>

    <!-- ไม่พบสินค้าที่ค้นหา -->
    <p
      v-if="!loading && filteredPokemons.length === 0"
      class="mt-10 text-center text-sm text-slate-500"
    >
      ไม่พบสินค้าที่ค้นหา
    </p>

    <!-- Cart Popup -->
    <CartPopup
      :show="showCartPopup"
      :product-name="lastAddedProduct?.name ?? ''"
      :quantity="lastAddedQuantity"
      @close="showCartPopup = false"
      @go-cart="handleGoCart"
    />

  </div>
</template>

<script setup lang="ts">
import pokemonCard from "../components/pokemonCard.vue";
import SearchBar from "../components/searchBar.vue";
import { fetchPokemonPage } from "../services/pokemon.service";
import type { PokemonModel } from "../models/pokemon.model";
import { ref, computed, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import pagination from "../components/pagination.vue";
import { cartStore } from "../stores/cart.store";
import CartPopup from "../components/CartPopup.vue"
import { useRouter } from "vue-router"

const cart = cartStore()

const pokemons = ref<PokemonModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const search = ref("");

const currentPage = ref(1)
const pageSize = ref(20)

const totalItems = ref(200)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / pageSize.value))
)

const showCartPopup = ref(false)
const lastAddedProduct = ref<PokemonModel | null>(null)
const router = useRouter()

const loadPage = async () => {
  loading.value = true
  error.value = null
  try {
    const pokemonsData = await fetchPokemonPage()
    pokemons.value = pokemonsData.map((p: any) => ({
      ...p,
      image: p.imageUrl,          // map imageUrl → image
      isOutofStock: p.stock === 0 // สร้าง field สำหรับปุ่ม
    }))

  } catch (e) {
    console.error(e)
    error.value = 'ไม่สามารถโหลดรายการสินค้าได้'
  } finally {
    loading.value = false
  }
}

onMounted(loadPage)

// เปลี่ยนหน้า / pageSize
const handlePageChange = () => {
  loadPage()
}

const filteredPokemons = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return pokemons.value
  return pokemons.value.filter((p) =>
  p.name.toLowerCase().includes(keyword));
});

const lastAddedQuantity = computed(() => {
  if (!lastAddedProduct.value) return 0;
  const item = cart.items.find(
    (i) => i.id === lastAddedProduct.value!.id
  );
  return item ? item.quantity : 0;
});

const handleAddToCart = (p: PokemonModel) => {
  cart.addItem(p);
  lastAddedProduct.value = p;
  showCartPopup.value = true;

  setTimeout(() => {
    showCartPopup.value = false;
  }, 3000);
};

const handleGoCart = () => {
  showCartPopup.value = false;
  router.push("/cart");
};

const handleSearchClick = () =>{
    console.log('search click:', search.value)
}
// จำนวนที่ส่งไป navbar
const cartCount = computed(() => cart.totalQuantity)
</script>
