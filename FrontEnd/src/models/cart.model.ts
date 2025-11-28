import type { PokemonModel } from "./pokemon.model"

export interface CartModel {
  id: number
  product: PokemonModel
  name: string
  price: number
  image: string
  quantity: number
  checked: boolean
}

