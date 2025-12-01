export interface PokemonModel{
    id: number;
    name: string;
    image: string;
    types: string[];
    price: number;
    isOutofStock: boolean;
}
export interface Pagination{
    count: number;
    next: string;
    previous: string;
    
}