import { defineStore } from "pinia";
import type { PokemonModel } from '../models/pokemon.model'
import type { CartModel } from "../models/cart.model";

export const cartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartModel[],
  }),

  getters: {
    // จำนวนชิ้นทั้งหมดในตะกร้า 
    totalQuantity: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),

    // ราคารวมของสินค้าที่เลือก
    selectedTotal: (state) =>
      state.items
        .filter((i) => i.checked)
        .reduce((sum, item) => sum + item.price * item.quantity, 0),

    // จำนวนรายการที่เลือก
    selectedCount: (state) =>
      state.items.filter((i) => i.checked).length,
  },

  actions: {
    addItem(product: PokemonModel) {
      const existing = this.items.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.items.push({
          id: product.id,
          product,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          checked: true,
        })
      }
    },

    removeItem(id: number) {
      this.items = this.items.filter((i) => i.id !== id)
    },

    setQuantity(id: number, qty: number) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      item.quantity = Math.max(1, qty)
    },

    increase(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.quantity += 1
    },

    decrease(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item && item.quantity > 1) item.quantity -= 1
    },

    toggleChecked(id: number) {
      const item = this.items.find((i) => i.id === id)
      if (item) item.checked = !item.checked
    },

    setAllChecked(value: boolean) {
      this.items.forEach((i) => (i.checked = value))
    },

    removeSelected() {
      this.items = this.items.filter((i) => !i.checked)
    },

    clear() {
      this.items = []
    },
  },
})


