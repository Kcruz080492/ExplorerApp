import type { CountryDetail } from "../types/country-detail";
import { formatPopulation, getCapital } from "../utils/format";


/** Escapa texto externo antes de insertarlo con innerHTML. */

function escapeHtml(value: string): string {

  const entities: Record<string, string> = {
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

export function renderDetail(country: CountryDetail): string {

  // names.native contiene una entrada por idioma.
  const nativeNames = Object.values(country.names.native ?? {});
  const nativeName =
    nativeNames[0]?.official ??
    nativeNames[0]?.common ??
    "No registrado";

  const currencies = country.currencies?.length
    ? country.currencies.map((item) => item.name).join(", ")
    : "No registradas";

  const languages = country.languages?.length
    ? country.languages.map((item) => item.name).join(", ")
    : "No registrados";

  const domains = country.tlds?.length
    ? country.tlds.join(", ")
    : "No registrados";

  const borders = country.borders?.length
    ? country.borders.map((code) =>

      `<span class="rounded-sm bg-neutral-0 px-5 py-2
          text-xs font-semibold text-neutral-900 shadow-sm">
          ${escapeHtml(code)}
        </span>`

    ).join("")

    : `<span class="text-sm text-neutral-600">
        Sin fronteras terrestres registradas
      </span>`;

  const flag = country.flag.url_svg

    ? `<img
        src="${escapeHtml(country.flag.url_svg)}"
        alt="${escapeHtml(

      country.flag.description ||
      `Bandera de ${country.names.common}`,
    )}"

        class="aspect-3/2 w-full rounded-sm bg-neutral-0
          object-contain shadow-sm"
      >`

    : `<div class="flex aspect-3/2 items-center
        justify-center rounded-sm bg-neutral-300">
        Bandera no disponible
      </div>`;

  return `
    <a href="#/" 
     class="mt-6 flex min-h-11 w-full items-center justify-center rounded-full
        bg-orange-500 px-5 py-2 text-lg font-medium text-neutral-900
        transition-all duration-200 hover:bg-orange-600 active:scale-95
        focus-visible:outline-2 focus-visible:outline-offset-2
        focus-visible:outline-blue-500 sm:w-32"
      aria-label="Volver atras">←</span> Atrás
    </a>

    <div class="mt-12 grid items-center gap-10
      lg:mt-16 lg:grid-cols-2 lg:gap-16">
      <div>${flag}</div>

      <div>
        <h1 class="text-3xl font-bold text-neutral-900 md:text-4xl">
          ${escapeHtml(country.names.common)}
        </h1>

        <div class="mt-8 grid gap-8 text-sm leading-7
          text-neutral-900 sm:grid-cols-2">

          <div>
            <p><strong>Nombre nativo:</strong>
              ${escapeHtml(nativeName)}</p>

            <p><strong>Población:</strong>
              ${formatPopulation(country.population)}</p>

            <p><strong>Región:</strong>
              ${escapeHtml(country.region)}</p>

            <p><strong>Subregión:</strong>
              ${escapeHtml(country.subregion || "No registrada")}</p>

            <p><strong>Capital:</strong>
              ${escapeHtml(getCapital(country))}</p>
          </div>

          <div>
            <p><strong>Dominio:</strong>
              ${escapeHtml(domains)}</p>

            <p><strong>Moneda:</strong>
              ${escapeHtml(currencies)}</p>

            <p><strong>Idiomas:</strong>
              ${escapeHtml(languages)}</p>
          </div>
        </div>

        <div class="mt-10 flex flex-wrap items-center gap-3">
          <h2 class="font-semibold text-neutral-900">
            Países fronterizos:
          </h2>
          ${borders}
        </div>
      </div>
    </div>`;
}



