<template>
  <div class="mx-auto max-w-[90rem] px-4 py-8">
    <navbar :cart-count="cart.totalQuantity" />

    <!-- เนื้อหาหลัก -->
    <main class="mx-auto max-w-[90rem] flex flex-col pb-32 pt-24 md:pt-28">
      <!-- รถเข็นว่าง -->
      <div
        v-if="cart.items.length === 0"
        class="flex flex-1 items-center justify-center py-16 text-sm text-slate-500"
      >
        ยังไม่มีสินค้าในรถเข็น
      </div>

      <!--สินค้าในรถเข็น -->
      <div v-else>
        <div
          class="overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-lg backdrop-blur"
        >
          <!-- หัวกล่อง -->
          <div class="flex items-center px-6 py-4 border-b bg-white/90">
            <h1 class="text-2xl font-bold text-slate-800">รถเข็น</h1>
          </div>

          <!-- ตารางสินค้า -->
          <table class="min-w-full text-sm">
            <thead class="bg-slate-50/80">
              <tr>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                >
                  <div class="flex items-center gap-4">
                    <input
                      type="checkbox"
                      :checked="allChecked"
                      @change="toggleAll"
                      class="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                    />
                    <span>สินค้า</span>
                  </div>
                </th>
                <th
                  class="px-6 py-4 text-right text-sm font-semibold text-slate-600"
                >
                  ราคาต่อชิ้น
                </th>
                <th
                  class="px-6 py-4 text-center text-sm font-semibold text-slate-600"
                >
                  จำนวน
                </th>
                <th
                  class="px-6 py-4 text-right text-sm font-semibold text-slate-600"
                >
                  ราคารวม
                </th>
                <th class="px-4 py-4"></th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in cart.items"
                :key="item.id"
                class="border-t border-slate-100/80 bg-white/80 hover:bg-slate-50/80"
              >
                <!-- สินค้า -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-4">
                    <input
                      type="checkbox"
                      :checked="item.checked"
                      @change="() => cart.toggleChecked(item.id)"
                      class="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
                    />
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="h-16 w-16 rounded-xl bg-slate-50 object-contain"
                    />
                    <div>
                      <div
                        class="text-base font-semibold text-slate-800 capitalize"
                      >
                        {{ item.name }}
                      </div>
                      <div class="text-sm text-slate-500">Pokémon</div>
                    </div>
                  </div>
                </td>

                <!-- ราคาต่อชิ้น -->
                <td class="px-12 py-4  text-right text-base text-slate-700 ">
                  ฿{{ item.price }}
                </td>

                <!-- จำนวน -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400 text-sm font-bold text-emerald-500 hover:bg-emerald-50"
                      @click="cart.decrease(item.id)"
                    >
                      −
                    </button>
                    <span
                      class="w-10 text-center text-base font-medium text-slate-800"
                    >
                      {{ item.quantity }}
                    </span>
                    <button
                      type="button"
                      class="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400 text-sm font-bold text-emerald-500 hover:bg-emerald-50"
                      @click="cart.increase(item.id)"
                    >
                      +
                    </button>
                  </div>
                </td>

                <!-- ราคารวม -->
                <td
                  class="px-10 py-4 text-right text-base font-semibold text-slate-800"
                >
                  ฿{{ item.price * item.quantity }}
                </td>

                <!-- ลบ -->
                <td class="px-6 py-8 text-center ">
                  <button
                    type="button"
                    @click="cart.removeItem(item.id)"
                    class="flex h-8 w-8 items-center justify-center rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 "
                  >
                    <Icon icon="tabler:trash-filled" width="20" height="20" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <CartFooter
    v-if="cart.items.length > 0"
    :selected-count="cart.selectedCount"
    :selected-total="cart.selectedTotal"
    :all-checked="allChecked"
    @select-all="cart.setAllChecked($event)"
    @remove-selected="cart.removeSelected()"
    @checkout="goCheckout"
  />
</template>

<script setup lang="ts">
import navbar from "../components/navbar.vue";
import CartFooter from "../components/CartFooter.vue";
import { cartStore } from "../stores/cart.store";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue"; 
import { createOrder } from "../services/orders.service";
  
const cart = cartStore();
const router = useRouter();

const allChecked = computed(
  () => cart.items.length > 0 && cart.items.every((i) => i.checked)
);

const toggleAll = (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked;
  cart.setAllChecked(checked);
};

// const goCheckout = () => {
//   router.push({ 
//     name: "MyOrdersView",
//     query: {
//       success: "1",
//       items: cart.selectedCount.toString(),
//     } 
//   });
// };

const goCheckout = async () => {
  const selectedItems = cart.items.filter((i) => i.checked);

  if (selectedItems.length === 0) {
    alert("กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ");
    return;
  }

  try {
    const orderData = await createOrder(selectedItems);

    cart.removeSelected();

    router.push({
      name: "MyOrdersView",
      query: {
        success: "1",
        items: selectedItems.length.toString(),
        orderCode: orderData.orderCode ?? "",
      },
    });
  } catch (e: any) {
    console.error("สร้างคำสั่งซื้อไม่สำเร็จ", e);
    alert("ไม่สามารถสร้างคำสั่งซื้อได้");
  }
};
</script>
