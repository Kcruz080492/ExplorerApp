import type { CountryDetail } from "../types/country-detail";

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char: string): string =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;",
       '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );

  export function renderDetail(country: CountryDetail): string {
  const name: string = escapeHtml(country.names.common);
  const borders: string = country.borders?.length
    ? country.borders.map((code: string): string =>
        `<span class="rounded bg-blue-100 px-3 py-1">${escapeHtml(code)}</span>`
      ).join(" ")
    : "Sin fronteras terrestres registradas";

    const flag: string = country.flag.url_svg
    ? `<img class="w-full max-w-sm" src="${escapeHtml(country.flag.url_svg)}"
         alt="${escapeHtml(country.flag.description || `Bandera de ${name}`)}">`
    : "<p>Bandera no disponible</p>";

  return `<div class="mx-auto max-w-5xl px-4 py-8">
    <a class="font-semibold text-blue-500" href="#/">← Volver a países</a>
    <div class="mt-8 grid gap-8 md:grid-cols-2">${flag}
      <div><h1 class="text-3xl font-bold">${name}</h1>
        <p>Población: ${country.population.toLocaleString("es-SV")}</p>
        <p>Región: ${escapeHtml(country.region)}</p>
        <p class="mt-4">Fronteras:</p><div class="flex flex-wrap gap-2">${borders}</div>
      </div>
    </div>
    </div>`;
}
