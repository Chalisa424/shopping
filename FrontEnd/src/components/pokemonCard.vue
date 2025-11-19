<template>
    <div class="flex h-full flex-col rounded-3xl bg-white p-4 shadow hover:shadow-lg transition">
        <!-- รูป -->
         <div class="mb-3 flex items-center justify-center">
            <img 
            :src="pokemon.image" 
            :alt="pokemon.name"
            class="h-32 w-32 object-contain"
            />
         </div>

         <!-- ชื่อ -->
          <div class="flex-1">
            <h3 class="text-base font-semibold text-slate-800 capitalize">
                {{ pokemon.name }}
            </h3>
            <p class="mt-1 text-xs text-slate-500">
                {{ pokemon.types.join(",") }}
            </p>
          </div>

          <!-- ราคา -->
           <div class="mt-3 flex items-center justify-between">
            <span class="text-sm font-bold text-red-500">
                ฿{{ pokemon.price }}
            </span>
           </div>

           <!-- ปุ่ม -->
           <div class="mt-3">
            <button
            v-if="pokemon.isOutofStock"
            disabled
            class="flex w-full items-center justify-center gap-1 rounded-xl border border-slate-300
               bg-slate-100 py-2 text-xs font-semibold text-slate-500 "
            >
            <Icon icon="ant-design:stop-outlined" width="18" height="18" />
            สินค้าหมด
            </button>

            <button
            v-else
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500
               py-2 text-xs font-semibold text-white hover:bg-emerald-600"

            @click="$emit('add-to-cart',pokemon)"
            >
            <Icon icon="material-symbols:shopping-cart-outline" width="24" height="24" />
            เพิ่มไปยังรถเข็น
            </button>
           </div> 
    </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { PokemonModel } from '../models/pokemon.model';

defineProps<{
  pokemon: PokemonModel;
}>();

defineEmits<{
    (e: "add-to-cart", value:PokemonModel): void;
}>();
</script>