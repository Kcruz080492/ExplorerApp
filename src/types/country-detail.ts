import type { Country } from "./country";

export interface CountryDetail extends Country {
    borders? : string[]; //La API devuelve código de tres letras
}