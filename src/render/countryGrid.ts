//src/render/countryGrid.ts
import type { Country } from "../types/country";
import { renderCountryCard } from "./countryCard";

export function renderCountryGrid(
  countries: Country[],
): string {
  return countries
    .map((country: Country): string =>
      renderCountryCard(country),
    )
    .join("");
}