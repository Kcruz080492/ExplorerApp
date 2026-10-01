// Demo docente: lee los datos publicados en Vercel, sin consultar REST Countries.
import type { Country } from "../types/country";
import type { CountryDetail } from "../types/country-detail";

// Comparte una sola carga del JSON durante la sesión de la página.
let countriesPromise: Promise<CountryDetail[]> | undefined;

function loadCountries(): Promise<CountryDetail[]> {
  if (!countriesPromise) {
    countriesPromise = (async (): Promise<CountryDetail[]> => {
      const response: Response = await fetch(
        `${import.meta.env.BASE_URL}data/countries.json`,
      );

      if (!response.ok) {
        throw new Error(`Error al cargar los datos de la demo: ${response.status}`);
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("El archivo de países está vacío o tiene un formato incorrecto.");
      }

      return data as CountryDetail[];
    })().catch((error: unknown) => {
      // Permite reintentar si la descarga del archivo falla.
      countriesPromise = undefined;
      throw error;
    });
  }

  return countriesPromise;
}

export async function fetchCountries(): Promise<Country[]> {
  return [...await loadCountries()];
}

export async function fetchCountryByCode(code: string): Promise<CountryDetail> {
  const countries: CountryDetail[] = await loadCountries();
  const normalizedCode: string = code.trim().toUpperCase();
  const country: CountryDetail | undefined = countries.find(
    (item: CountryDetail): boolean =>
      item.codes.alpha_2.toUpperCase() === normalizedCode,
  );

  if (!country) {
    throw new Error("No se encontró el país solicitado en los datos de la demo.");
  }

  return country;
}
