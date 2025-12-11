<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
    <div
      class="w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 md:p-7 relative"
    >
      <!-- ปุ่มปิด -->
      <button
        type="button"
        class="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
        @click="handleClose"
      >
        ✕
      </button>

      <h2 class="text-lg md:text-xl font-bold text-slate-900 mb-4">
        แก้ไขสินค้า
      </h2>

      <!-- error จากการ save -->
      <div
        v-if="submitError"
        class="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600"
      >
        {{ submitError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- ชื่อสินค้า -->
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">
            ชื่อสินค้า <span class="text-rose-500">*</span>
          </label>
          <input
            v-model.trim="form.name"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <!-- ราคา / จำนวนคงเหลือ -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">
              ราคา (฿) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.price"
              type="number"
              min="0"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm
                     focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">
              จำนวนคงเหลือ <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm
                     focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
            />
          </div>
        </div>

        <!-- หมวดหมู่ -->
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">
            หมวดหมู่ <span class="text-rose-500">*</span>
          </label>
          <input
            v-model.trim="form.category"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <!-- URL รูป -->
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">
            รูปภาพ (Image URL)
          </label>
          <input
            v-model.trim="form.imageUrl"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
          />
        </div>

        <!-- description -->
        <div>
          <label class="block text-xs font-medium text-slate-600 mb-1">
            รายละเอียด
          </label>
          <textarea
            v-model.trim="form.description"
            rows="3"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm
                   focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none"
          ></textarea>
        </div>

        <!-- ปุ่ม -->
        <div class="mt-4 flex justify-end gap-3">
          <button
            type="button"
            class="rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            @click="handleClose"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="submitting"
          >
            <span v-if="!submitting">บันทึก</span>
            <span v-else>กำลังบันทึก...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { ProductModel, ProductUpdate } from "../models/product.model";
import { updateProduct } from "../services/products.service";

const props = defineProps<{
  product: ProductModel;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "updated", product: ProductModel): void;
}>();

const form = ref<ProductUpdate>({
  name: "",
  description: "",
  price: 0,
  stock: 0,
  category: "",
  imageUrl: "",
});

const submitting = ref(false);
const submitError = ref<string | null>(null);

// เติมค่าเริ่มต้นจาก props.product ทุกครั้งที่เปิด modal
watchEffect(() => {
  if (!props.product) return;
  form.value = {
    name: props.product.name,
    description: props.product.description ?? "",
    price: props.product.price,
    stock: props.product.stock,
    category: props.product.category,
    imageUrl: props.product.imageUrl,
  };
});

const handleClose = () => {
  if (!submitting.value) {
    emit("close");
  }
};

const handleSubmit = async () => {
  submitError.value = null;

  if (!form.value.name || !form.value.category) {
    submitError.value = "กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, หมวดหมู่)";
    return;
  }

  submitting.value = true;
  try {
    const updated = await updateProduct(props.product.id, form.value);
    emit("updated", updated);    //ส่ง product ที่แก้แล้วกลับไปให้หน้า list
  } catch (err) {
    console.error(err);
    submitError.value = "บันทึกสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
  } finally {
    submitting.value = false;
  }
};
</script>
