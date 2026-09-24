// countries.ts — Comunicación con REST Countries API
import type { Country, CountriesResponse } from "../types/country";

import type { CountryDetail } from "../types/country-detail";

// Describe la parte de la respuesta que contiene el país consultado.
interface DetailResponse { data: { objects: CountryDetail[] }; }


const API_KEY: string =
  import.meta.env.VITE_REST_COUNTRIES_API_KEY;

const API_URL: string =
  "https://api.restcountries.com/countries/v5";

// Máximo permitido por petición en el plan gratuito.
const PAGE_SIZE: number = 100;

/**
 * Obtiene todos los países mediante varias peticiones.
 */
export async function fetchCountries(): Promise<Country[]> {
  if (!API_KEY) {
    throw new Error(
      "No se encontró la API key de REST Countries.",
    );
  }

  const allCountries: Country[] = [];

  let offset: number = 0;
  let hasMoreCountries: boolean = true;

  while (hasMoreCountries) {
    //construye la url para la pagin que corresponde
    const url: URL = new URL(API_URL);

url.searchParams.set(
  "response_fields",
  "names.common,codes.alpha_2,flag.url_svg," +
    "flag.description,population,region,capitals",
);

    url.searchParams.set("limit", String(PAGE_SIZE));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("api-key", API_KEY);

    const response: Response = await fetch(url);
    if (!response.ok){
      throw new Error(
        `Error HTTP al cargar paises: ${response.status}`
      )
    }

   const result: CountriesResponse =
      await response.json() as CountriesResponse;

    // Agrega los países de esta página al arreglo general.
    allCountries.push(
      ...result.data.objects,
    );

    // La propiedad more indica si existe otra página.
    hasMoreCountries =
      result.data.meta.more;

    // Prepara el desplazamiento de la siguiente petición.
    offset += PAGE_SIZE;
  }

  return allCountries;
}

/**
 * Obtiene los datos de un país a partir de su código de dos letras.
 */
export async function fetchCountryByCode(
  code: string,
): Promise<CountryDetail> {
  if (!API_KEY) throw new Error("No se encontro la API key de REST COUNTRIES.",
 );

  const url: URL = new URL(
    `${API_URL}/codes.alpha_2/${encodeURIComponent(code)}`,
  );

 url.searchParams.set(
  "response_fields",
  "names.common,names.native,codes.alpha_2," +
    "flag.url_svg,flag.description,population,region," +
    "subregion,capitals,tlds,currencies,languages,borders",
);

  url.searchParams.set("api-key", API_KEY);

  const response: Response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Error HTTP al cargar el detalle: ${response.status}`,
    );
  }
  const payload: DetailResponse = await response.json() as DetailResponse;

  const country: CountryDetail | undefined = payload.data.objects[0];

  if  (!country){
     throw new Error("No se encontró el país solicitado.");
 }
  return country;
}




