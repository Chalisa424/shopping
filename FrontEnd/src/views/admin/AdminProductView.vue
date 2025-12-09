<template>
  <div class="mx-auto max-w-6xl px-4 py-8 space-y-4">
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
      <div class="border-b border-slate-100 px-6 pb-4">
        <SearchBar
          v-model="searchQuery"
          placeholder="ค้นหาสินค้า"
          @search="handleSearchClick"
        />
      </div>

      <!-- เนื้อหา -->
      <div class="px-6 pb-6 pt-2">
        <!-- Loading -->
        <div v-if="loading" class="py-10 text-center text-sm text-slate-500">
          กำลังโหลดรายการสินค้า...
        </div>

        <!-- Error -->
        <div v-else-if="error" class="py-10 text-center text-sm text-rose-500">
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
          <table class="mt-3 w-full text-[13px] text-slate-700">
            <!-- หัวคอลัมน์ -->
            <thead class="bg-slate-50 text-xs font-semibold text-slate-500">
              <tr>
                <!-- รูปภาพ -->
                <th class="w-[18%] px-4 py-3 text-left whitespace-nowrap">
                  รูปภาพสินค้า
                </th>
                <!-- ชื่อสินค้า -->
                <th class="w-[30%] px-4 py-3 text-left">
                  ชื่อสินค้า
                </th>
                <!-- ราคา -->
                <th class="w-[12%] px-4 py-3 text-center">
                  ราคา
                </th>
                <!-- จำนวนคงเหลือ -->
                <th class="w-[14%] px-4 py-3 text-center whitespace-nowrap">
                  จำนวนคงเหลือ
                </th>
                <!-- หมวดหมู่ -->
                <th class="w-[16%] px-4 py-3 text-center">
                  หมวดหมู่
                </th>
                <!-- การจัดการ -->
                <th class="w-[10%] px-4 py-3 text-center">
                  การจัดการ
                </th>
              </tr>
            </thead>

            <!-- เนื้อหาแถว -->
            <tbody>
              <tr
                v-for="product in paginatedProducts"
                :key="product.id"
                class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
              >
                <!-- รูปสินค้า -->
                <td class="w-[18%] px-4 py-3 align-middle">
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
                <td class="w-[30%] px-4 py-3 align-middle">
                  <div class="flex flex-col">
                    <span
                      class="text-sm font-semibold text-slate-800 capitalize"
                    >
                      {{ product.name }}
                    </span>
                    <span v-if="product.code" class="text-xs text-slate-400">
                      รหัส: {{ product.code }}
                    </span>
                  </div>
                </td>

                <!-- ราคา -->
                <td class="w-[12%] px-4 py-3 text-center align-middle">
                  <span class="font-semibold text-rose-500">
                    ฿{{ product.price }}
                  </span>
                </td>

                <!-- stock -->
                <td class="w-[14%] px-4 py-3 text-center whitespace-nowrap align-middle">
                  {{ product.stock }} ชิ้น
                </td>

                <!-- category -->
                <td class="w-[16%] px-4 py-3 text-center align-middle">
                  {{ product.category }}
                </td>

                <!-- การจัดการ -->
                <td class="w-[10%] px-4 py-3 text-center align-middle">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-500 hover:bg-amber-100"
                      @click="onEditProduct(product)"
                    >
                      <Icon icon="mdi:pencil" width="16" height="16" />
                    </button>
                    <button
                      type="button"
                      class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
                      @click="onDeleteProduct(product)"
                    >
                      <Icon icon="mdi:trash" width="16" height="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        @update:currentPage="(p) => (currentPage = p)"
        @update:pageSize="handlePageSizeChange"
      />
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { Icon } from "@iconify/vue";
import SearchBar from "../../components/searchBar.vue";
import pagination from "../../components/pagination.vue";
import type { ProductModel } from "../../models/product.model";
import { fetchAdminProducts } from "../../services/products.service";

const products = ref<ProductModel[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref("");

// pagination
const currentPage = ref(1);
const pageSize = ref(10);
const pageSizeOptions = [5, 10, 20, 50];

const totalPages = computed(() =>
  Math.max(1, Math.ceil(products.value.length / pageSize.value))
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return products.value.slice(start, start + pageSize.value);
});

// load products
const loadProducts = async (q = "") => {
  loading.value = true;
  error.value = null;
  try {
    const data = await fetchAdminProducts(q);
    products.value = data;
    currentPage.value = 1;
  } catch (e) {
    console.error(e);
    error.value = "ไม่สามารถโหลดรายการสินค้าได้";
  } finally {
    loading.value = false;
  }
};

// debounce search
let searchTimeout: any = null;
watch(searchQuery, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => loadProducts(val), 450);
});

const handleSearchClick = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  loadProducts(searchQuery.value);
};

const handlePageSizeChange = (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

// actions (ยังไม่ต่อ backend)
const onAddProduct = () => {
  alert("ฟีเจอร์เพิ่มสินค้า ยังไม่ได้ทำ (ไว้ต่อทีหลังนะ)");
};
const onEditProduct = (p: ProductModel) => {
  alert(`แก้ไขสินค้า: ${p.name} (ยังไม่ได้ทำหน้าแก้ไข)`);
};
const onDeleteProduct = (p: ProductModel) => {
  alert(`ลบสินค้า: ${p.name} (ยังไม่ได้ต่อ API ลบ)`);
};

onMounted(() => {
  loadProducts();
});
</script>
