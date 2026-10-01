// Ejecutar UNA VEZ desde la raíz: node scripts/exportar-paises.mjs
import { readFile, mkdir, writeFile, access } from "node:fs/promises";

const destination = "public/data/countries.json";

async function main() {
  try {
    await access(destination);
    console.log("Ya existe public/data/countries.json. No se consultó la API.");
    return;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  let apiKey = process.env.VITE_REST_COUNTRIES_API_KEY?.trim();
  if (!apiKey) {
    const env = await readFile(".env", "utf8");
    const match = env.match(/^\s*(?:export\s+)?VITE_REST_COUNTRIES_API_KEY\s*=\s*(.*?)\s*$/m);
    const raw = match?.[1] ?? "";
    apiKey = raw.startsWith('"') || raw.startsWith("'")
      ? raw.slice(1, raw.lastIndexOf(raw[0])).trim()
      : raw.replace(/\s+#.*$/, "").trim();
  }
  if (!apiKey) throw new Error("Falta VITE_REST_COUNTRIES_API_KEY en .env.");

  const countries = [];
  const fields = "names.common,names.native,codes.alpha_2," +
    "flag.url_svg,flag.description,population,region," +
    "subregion,capitals,tlds,currencies,languages,borders";
  let offset = 0;
  let requests = 0;
  while (true) {
    const url = new URL("https://api.restcountries.com/countries/v5");
    url.searchParams.set("response_fields", fields);
    url.searchParams.set("limit", "100");
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("api-key", apiKey);
    // El proveedor recibe localhost como origen, ya autorizado para esta clave.
    const response = await fetch(url, { headers: { Origin: "http://localhost:5173" } });
    requests++;
    if (!response.ok) {
      throw new Error(`La exportación falló: HTTP ${response.status}. Revisa la clave, cuota y autorización de localhost. No se guardaron datos parciales.`);
    }
    const payload = await response.json();
    const page = payload?.data?.objects;
    const more = payload?.data?.meta?.more;
    if (!Array.isArray(page) || typeof more !== "boolean") {
      throw new Error("La respuesta no tiene la estructura esperada. No se guardaron datos parciales.");
    }
    if (page.some(country => typeof country?.codes?.alpha_2 !== "string")) {
      throw new Error("La respuesta contiene países sin código. No se guardaron datos parciales.");
    }
    countries.push(...page);
    console.log(`Página ${requests}: ${page.length} países.`);
    if (!more) break;
    if (page.length === 0) throw new Error("La API indica más páginas pero devolvió una página vacía.");
    offset += 100;
  }
  if (countries.length === 0) throw new Error("La API no devolvió países.");
  await mkdir("public/data", { recursive: true });
  await writeFile(destination, JSON.stringify(countries, null, 2) + "\n", "utf8");
  console.log(`Guardados ${countries.length} países en ${destination}. Peticiones realizadas: ${requests}.`);
}

main().catch(error => {
  // No imprimir la URL de la petición ni la clave.
  console.error(error.message);
  process.exitCode = 1;
});
