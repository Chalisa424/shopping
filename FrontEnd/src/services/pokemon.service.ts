import type { PokemonModel } from "../models/pokemon.model";
import httpClient from "./main.service";

export const fetchPokemonPage = async (
): Promise<PokemonModel[]> => {
  const data = await httpClient.get("products");
  return data.data
};
