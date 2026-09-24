// format.ts — Funciones auxiliares para presentar los datos

import type { Country } from "../types/country";

const populationFormatter: Intl.NumberFormat =
  new Intl.NumberFormat("es-SV");

export function formatPopulation(
  population: number
): string {
  return populationFormatter.format(population);
}

export function getCapital(
  country: Country
): string {
  return country.capitals[0]?.name ??
    "Sin capital registrada";
}

export function getFlagDescription(
  country: Country
): string {
  return country.flag.description ||
    `Bandera de ${country.names.common}`;
}