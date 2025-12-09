<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- กล่องหลัก -->
    <div
      class="rounded-3xl bg-white shadow-lg overflow-hidden border border-slate-100"
    >
      <!-- หัวกล่อง -->
      <div
        class="flex flex-col gap-3 border-b bg-white px-6 py-4 md:flex-row md:items-center md:justify-between"
      >
        <h1 class="text-lg md:text-xl font-bold text-slate-900">
          จัดการสินค้า
        </h1>

        <!-- ช่องค้นหา + ปุ่มเพิ่มสินค้า -->
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <!-- search -->
          <div
            class="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5"
          >
            <Icon
              icon="mdi:magnify"
              width="18"
              height="18"
              class="text-slate-400"
            />
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหาสินค้า"
              class="w-48 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none md:w-64"
            />
          </div>

          <!-- ปุ่มเพิ่มสินค้าใหม่ -->
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
            @click="handleCreate"
          >
            <Icon icon="mdi:plus" width="18" height="18" />
            เพิ่มสินค้าใหม่
          </button>
        </div>
      </div>

      <!-- ตารางสินค้า -->
      <div class="px-4 pb-4 pt-2">
        <table class="mt-2 w-full text-left text-xs md:text-sm text-slate-700">
          <thead class="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th class="w-24 px-4 py-2">รูปภาพสินค้า</th>
              <th class="px-4 py-2">ชื่อสินค้า</th>
              <th class="w-24 px-4 py-2 text-right">ราคา</th>
              <th class="w-32 px-4 py-2 text-center">จำนวนคงเหลือ</th>
              <th class="w-32 px-4 py-2 text-center">หมวดหมู่</th>
              <th class="w-28 px-4 py-2 text-center">การจัดการ</th>
            </tr>
          </thead>

          <tbody>
            <!-- ถ้าไม่มีสินค้า -->
            <tr v-if="filteredProducts.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-slate-500">
                ยังไม่มีสินค้า หรือไม่พบสินค้าที่ค้นหา
              </td>
            </tr>

            <!-- แสดงรายการสินค้า -->
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="border-b border-slate-100 hover:bg-slate-50/70"
            >
              <!-- รูป -->
              <td class="px-4 py-3">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="h-14 w-14 rounded-xl bg-slate-50 object-contain"
                />
              </td>

              <!-- ชื่อ -->
              <td class="px-4 py-3 align-top">
                <div class="font-semibold text-slate-800">
                  {{ product.name }}
                </div>
                <div class="text-[11px] text-slate-500">
                  รหัส: {{ product.code }}
                </div>
              </td>

              <!-- ราคา -->
              <td class="px-4 py-3 text-right font-semibold text-rose-500">
                ฿{{ product.price }}
              </td>

              <!-- คงเหลือ -->
              <td class="px-4 py-3 text-center">
                {{ product.stock }} ชิ้น
              </td>

              <!-- หมวดหมู่ -->
              <td class="px-4 py-3 text-center">
                {{ product.category }}
              </td>

              <!-- ปุ่มจัดการ -->
              <td class="px-4 py-3">
                <div class="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100"
                    @click.stop="handleEdit(product)"
                  >
                    <Icon icon="mdi:pencil" width="18" height="18" />
                  </button>
                  <button
                    type="button"
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100"
                    @click.stop="handleDelete(product)"
                  >
                    <Icon icon="mdi:trash-can-outline" width="18" height="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Icon } from "@iconify/vue";

type AdminProduct = {
  id: number;
  code: string;
  name: string;
  image: string;
  price: number;
  stock: number;
  category: string;
};

// TODO: ไว้ต่อ API จริงภายหลัง ตอนนี้ใช้ mock data ให้เห็น layout ก่อน
const products = ref<AdminProduct[]>([
  {
    id: 1,
    code: "P001",
    name: "bulbasaur",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    price: 57,
    stock: 10,
    category: "Pokémon",
  },
  {
    id: 2,
    code: "P002",
    name: "ivysaur",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
    price: 73,
    stock: 5,
    category: "Pokémon",
  },
]);

const search = ref("");

const filteredProducts = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return products.value;
  return products.value.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
});

// handler ไว้ให้ต่อ dialog / แบบฟอร์มทีหลัง
const handleCreate = () => {
  console.log("create product");
};

const handleEdit = (product: AdminProduct) => {
  console.log("edit product", product);
};

const handleDelete = (product: AdminProduct) => {
  console.log("delete product", product);
};
</script>
