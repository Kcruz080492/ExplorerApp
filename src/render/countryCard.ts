// countryCard.ts — Construcción de una tarjeta de país

import type { Country } from "../types/country";

import {
  formatPopulation,
  getCapital,
  getFlagDescription,
} from "../utils/format";

export function renderCountryCard(
  country: Country
): string {
  const capital: string =
    getCapital(country);

  const flagDescription: string =
    getFlagDescription(country);

  const formattedPopulation: string =
    formatPopulation(country.population);

  return `
    <article
      class="group flex w-full flex-col overflow-hidden rounded-lg bg-neutral-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2"
    >
      <img
        class="aspect-3/2 w-full shrink-0 object-cover"
        src="${country.flag.url_svg || "/placeholder.png"}"
        alt="${flagDescription}"
        loading="lazy"
        onerror="this.onerror=null; this.src='/placeholder.png';"
      >

      <div class="flex flex-1 flex-col p-5">
      
        <h2 class="text-xl font-bold text-neutral-900">
          ${country.names.common}
        </h2>

        <dl class="mt-4 space-y-3 text-base">
          <div class="grid grid-cols-[84px_1fr] gap-3">
            <dt class="font-semibold">
              Población:
            </dt>

            <dd>
              ${formattedPopulation}
            </dd>
          </div>

          <div class="grid grid-cols-[84px_1fr] gap-3">
            <dt class="font-semibold">
              Región:
            </dt>

            <dd>
              ${country.region}
            </dd>
          </div>

          <div class="grid grid-cols-[84px_1fr] gap-3">
            <dt class="font-semibold">
              Capital:
            </dt>

            <dd>
              ${capital}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          class="mt-6 flex min-h-11 w-full items-center justify-center rounded-full bg-orange-500 px-5 py-2 text-lg font-medium text-neutral-900 transition-all duration-200 hover:bg-orange-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:w-32"
          aria-label="Ver más información de ${country.names.common}"
        >
          Ver más
        </button>
      </div>
    </article>
  `;
}