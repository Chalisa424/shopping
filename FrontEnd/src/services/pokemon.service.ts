import axios from "axios";
import type { PokemonModel } from "../models/pokemon.model";

const pokemonApi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const fetchPokemonPage = async (
  page = 1,
  pageSize = 12
): Promise< PokemonModel[] > => {
  const offset = (page - 1)* pageSize;

  const {data} = await pokemonApi.get("/pokemon", {
    params: { limit: pageSize, offset},
  });

  const detailRequests = data.results.map((item: any) =>
    pokemonApi.get(item.url)
);

const detailResponse = await Promise.all(detailRequests);

return detailResponse.map((res:any) => {
    const pokemonData = res.data;
    const image =
        pokemonData.sprites.other?.["official-artwork"]?.front_default ||
        pokemonData.sprites.front_default;

    return{
        id: pokemonData.id,
        name: pokemonData.name,
        image,
        types: pokemonData.types.map((t: any) => t.type.name),
        price: (pokemonData.id * 7) % 100 + 20,
        isOutofStock: pokemonData.id % 3 === 0,
    } as PokemonModel;
});

};
