// countries.ts — Comunicación con REST Countries API
import type {
  Country,
  CountriesResponse,
} from "../types/country";

const API_KEY: string =
  import.meta.env.VITE_REST_COUNTRIES_API_KEY;

  if (!API_KEY) {
  throw new Error(
    "No se encontró la API key de REST Countries."
  );
}

// Máximo permitido por petición en el plan gratuito.
const PAGE_SIZE: number = 100;

const API_URL: string =
  "https://api.restcountries.com/countries/v5" +
  "?response_fields=names.common,codes.alpha_2,flag.url_svg," +
  "flag.description,population,region,capitals";

  /**
 * Obtiene todos los países realizando varias peticiones
 * mediante limit y offset.
 */

  export async function fetchCountries(): Promise<Country[]> {
 
  const allCountries: Country[] = [];

  let offset: number = 0;
  let hasMoreCountries: boolean = true;

  while (hasMoreCountries) {
    const response: Response = await fetch(
      `${API_URL}&limit=${PAGE_SIZE}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      },
    );

  if (!response.ok) {
    throw new Error(
       `Error HTTP: ${response.status}`,
    );
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