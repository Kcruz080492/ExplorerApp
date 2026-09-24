// src/types/appState.ts — Estados posibles de la aplicación

import type { Country } from "./country";

export type AppState =
  | { status: "loading" }
  | { status: "success"; data: Country[] }
  | { status: "empty"; query: string }
  | { status: "error"; message: string };
