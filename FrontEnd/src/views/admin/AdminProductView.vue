<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- กล่องหลัก -->
    <section
      class="rounded-3xl bg-white shadow-lg border border-slate-100 overflow-hidden"
    >
      <!-- แถวบน: ชื่อ + ปุ่มเพิ่ม -->
      <header
        class="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between"
      >
        <h1 class="text-lg md:text-xl font-bold text-slate-900">
          จัดการสินค้า
        </h1>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          @click="onAddProduct"
        >
          <Icon icon="mdi:plus" width="18" height="18" />
          เพิ่มสินค้าใหม่
        </button>
      </header>

      <!-- แถวค้นหา -->
      <div class=" border-b border-slate-100 px-6 pb-4">
        <SearchBar
          v-model="searchQuery"
          placeholder="ค้นหาสินค้า"
          @search="handleSearchClick"
        />
      </div>

      <!-- เนื้อหา -->
      <div class="px-4 pb-4 pt-2">
        <!-- Loading -->
        <div
          v-if="loading"
          class="py-10 text-center text-sm text-slate-500"
        >
          กำลังโหลดรายการสินค้า...
        </div>

        <!-- Error -->
        <div
          v-else-if="error"
          class="py-10 text-center text-sm text-rose-500"
        >
          {{ error }}
        </div>

        <!-- ไม่มีข้อมูล -->
        <div
          v-else-if="products.length === 0"
          class="py-10 text-center text-sm text-slate-500"
        >
          ยังไม่มีรายการสินค้า
        </div>

        <!-- ตารางสินค้า -->
        <div v-else>
          <table
            class="mt-2 w-full table-auto text-sm text-slate-700"
          >
            <thead
              class="bg-slate-50 text-xs font-semibold text-slate-500"
            >
              <tr>
                <th
                  class="w-44 px-4 py-2 text-left whitespace-nowrap"
                >
                  รูปภาพสินค้า
                </th>
                <th class="w-[320px] px-4 py-2 text-left">
                  ชื่อสินค้า
                </th>
                <th class="w-24 px-4 py-2 text-right">
                  ราคา
                </th>
                <th
                  class="w-32 px-4 py-2 text-right whitespace-nowrap"
                >
                  จำนวนคงเหลือ
                </th>
                <th class="w-32 px-4 py-2 text-left">
                  หมวดหมู่
                </th>
                <th class="w-32 px-4 py-2 text-center">
                  การจัดการ
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
              >
                <!-- รูปสินค้า-->
                <td class="px-4 py-3 align-middle">
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden"
                    >
                      <img
                        :src="product.imageUrl"
                        :alt="product.name"
                        class="h-16 w-16 object-contain"
                      />
                    </div>
                  </div>
                </td>

                <!-- ชื่อ + รหัส -->
                <td class="px-4 py-3 align-middle">
                  <div class="flex flex-col">
                    <span
                      class="text-sm font-semibold text-slate-800 capitalize"
                    >
                      {{ product.name }}
                    </span>
                    <span
                      v-if="product.code"
                      class="text-xs text-slate-400"
                    >
                      รหัส: {{ product.code }}
                    </span>
                  </div>
                </td>

                <!-- ราคา -->
                <td class="px-4 py-3 text-right align-middle">
                  <span class="font-semibold text-rose-500">
                    ฿{{ product.price }}
                  </span>
                </td>

                <!-- stock -->
                <td
                  class="px-4 py-3 text-right whitespace-nowrap align-middle"
                >
                  {{ product.stock }} ชิ้น
                </td>

                <!-- category -->
                <td class="px-4 py-3 text-left align-middle">
                  {{ product.category }}
                </td>

                <!-- การจัดการ -->
                <td class="px-4 py-3 text-center align-middle">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100"
                      @click="onEditProduct(product)"
                    >
                      <Icon
                        icon="mdi:pencil"
                        width="16"
                        height="16"
                      />
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
                      @click="onDeleteProduct(product)"
                    >
                      <Icon
                        icon="mdi:trash"
                        width="16"
                        height="16"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div
            class="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500"
          >
            <div>
              แสดง
              {{ startItemIndex + 1 }}
              -
              {{ endItemIndex }}
              จาก
              {{ products.length }} รายการ
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                class="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage === 1"
                @click="goPrevPage"
              >
                ก่อนหน้า
              </button>

              <button
                v-for="page in totalPages"
                :key="page"
                type="button"
                class="h-7 w-7 rounded-full text-xs font-medium flex items-center justify-center"
                :class="
                  page === currentPage
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                "
                @click="goToPage(page)"
              >
                {{ page }}
              </button>

              <button
                type="button"
                class="rounded-full border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="currentPage === totalPages"
                @click="goNextPage"
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import SearchBar from "../../components/searchBar.vue";
import type { ProductModel } from "../../models/product.model";
import { fetchAdminProducts } from "../../services/products.service";

const products = ref<ProductModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref("");

// ---------- Pagination state ----------
const currentPage = ref(1);
const pageSize = 10; // 10 รายการต่อหน้า

const totalPages = computed(() =>
  products.value.length === 0
    ? 1
    : Math.ceil(products.value.length / pageSize)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return products.value.slice(start, start + pageSize);
});

const startItemIndex = computed(
  () => (currentPage.value - 1) * pageSize
);

const endItemIndex = computed(() =>
  Math.min(startItemIndex.value + paginatedProducts.value.length, products.value.length)
);

// ---------- Load products ----------
const loadProducts = async (q: string = "") => {
  loading.value = true;
  error.value = null;

  try {
    const data = await fetchAdminProducts(q);
    products.value = data;
    currentPage.value = 1; // reset หน้าเมื่อค้นหาใหม่
  } catch (e) {
    console.error(e);
    error.value = "ไม่สามารถโหลดรายการสินค้าได้";
  } finally {
    loading.value = false;
  }
};

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

watch(
  () => searchQuery.value,
  (newVal) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadProducts(newVal);
    }, 400);
  }
);

// ปุ่มค้นหาใน SearchBar
const handleSearchClick = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  loadProducts(searchQuery.value);
};

// Pagination
const goPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const goNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// ปุ่มเพิ่ม / แก้ไข / ลบ (ยังไม่ต่อ API)
const onAddProduct = () => {
  alert("ฟีเจอร์เพิ่มสินค้า ยังไม่ได้ทำ (ไว้ต่อทีหลังนะ)");
};

const onEditProduct = (product: ProductModel) => {
  console.log("edit", product);
  alert(`แก้ไขสินค้า: ${product.name} (ยังไม่ได้ทำหน้าแก้ไข)`);
};

const onDeleteProduct = (product: ProductModel) => {
  console.log("delete", product);
  alert(`ลบสินค้า: ${product.name} (ยังไม่ได้ต่อ API ลบ)`);
};

onMounted(() => {
  loadProducts();
});
</script>
