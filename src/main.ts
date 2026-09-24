//src/main.ts
// ======================================================
// 1. IMPORTACIONES
// ======================================================

// Importa los estilos generales y las clases de Tailwind CSS.
import "./style.css";

// Obtiene los países desde la API.
import { fetchCountries } from "./api/countries";

// Convierte un arreglo de países en las tarjetas del grid.
import { renderCountryGrid } from "./render/countryGrid";

//Importa unicamente el tipo Country para el tipado
import type { Country } from "./types/country";

//Filtra los paises por nombre y region 
import { filterCountries } from "./utils/filter";

//Importa las funciones que muestran los estados visuales
// de carga, ausencia de resultados y error.
import { renderEmpty, renderError, renderLoading } from "./render/states";

import { fetchCountryByCode } from "./api/countries";

import { renderDetail } from "./render/detail";


// ======================================================
// 2. REFERENCIAS DEL MENÚ DE NAVEGACIÓN MÓVIL
// ======================================================

// Botón utilizado para abrir y cerrar el menú móvil.
const menuButton: HTMLButtonElement | null =
  document.querySelector<HTMLButtonElement>(
    "#menu-toggle",
  );

// Contenedor principal del menú de navegación.
const mainMenu: HTMLElement | null =
  document.querySelector<HTMLElement>(
    "#main-menu",
  );

// Ícono que representa el menú abierto.
const openIcon: SVGElement | null =
  document.querySelector<SVGElement>(
    "#menu-open-icon",
  );

// Ícono que representa el cierre del menú.
const closeIcon: SVGElement | null =
  document.querySelector<SVGElement>(
    "#menu-close-icon",
  );


// ======================================================
// 3. CONTROL DEL MENÚ MÓVIL
// ======================================================

/**
 * Actualiza el estado visual y accesible del menú móvil.
 *
 * @param isOpen Indica si el menú debe mostrarse abierto.
 */
function setMenuState(isOpen: boolean): void {
  // Detiene la función si alguno de los elementos no existe.
  if (
    !menuButton ||
    !mainMenu ||
    !openIcon ||
    !closeIcon
  ) {
    return;
  }

  // Muestra u oculta el menú.
  mainMenu.classList.toggle(
    "hidden",
    !isOpen,
  );

  // Alterna los íconos del botón.
  openIcon.classList.toggle(
    "hidden",
    isOpen,
  );

  closeIcon.classList.toggle(
    "hidden",
    !isOpen,
  );

  // Comunica el estado del menú a las tecnologías de asistencia.
  menuButton.setAttribute(
    "aria-expanded",
    String(isOpen),
  );

  // Actualiza la descripción accesible del botón.
  menuButton.setAttribute(
    "aria-label",
    isOpen
      ? "Cerrar menú de navegación"
      : "Abrir menú de navegación",
  );
}


// ======================================================
// 4. EVENTOS DEL MENÚ MÓVIL
// ======================================================

// Los eventos se registran solamente si existen
// el botón y el menú principal.
if (menuButton && mainMenu) {
  // Abre o cierra el menú cuando se presiona el botón.
  menuButton.addEventListener(
    "click",
    (): void => {
      const isOpen: boolean =
        menuButton.getAttribute(
          "aria-expanded",
        ) === "true";

      setMenuState(!isOpen);
    },
  );

  // Cierra el menú cuando se selecciona un enlace.
  mainMenu
    .querySelectorAll<HTMLAnchorElement>("a")
    .forEach(
      (link: HTMLAnchorElement): void => {
        link.addEventListener(
          "click",
          (): void => {
            setMenuState(false);
          },
        );
      },
    );

  // Cierra el menú al presionar la tecla Escape.
  document.addEventListener(
    "keydown",
    (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setMenuState(false);
        menuButton.focus();
      }
    },
  );

  // Detecta cuando la pantalla cambia al tamaño de escritorio.
  const desktopBreakpoint: MediaQueryList =
    window.matchMedia(
      "(min-width: 768px)",
    );

  // Restablece el estado del menú al cambiar
  // entre la vista móvil y la vista de escritorio.
  desktopBreakpoint.addEventListener(
    "change",
    (): void => {
      setMenuState(false);
    },
  );
}


// ======================================================
// 5. REFERENCIAS DE LA SECCIÓN DE PAÍSES
// ======================================================

// Contenedor donde se mostrarán las tarjetas de países.
const countriesContainer: HTMLElement | null =
  document.querySelector<HTMLElement>(
    "#countries-container",
  );

//Campo donde el usuario escribe el nombre del pais 
const countrySearch: HTMLInputElement | null =
  document.querySelector<HTMLInputElement>(
    "#country-search",
  );

//Selector utilizado para filtrar por region
const regionFilter: HTMLSelectElement | null =
  document.querySelector<HTMLSelectElement>(
    "#region-filter",
  );

const homeView: HTMLElement | null = document.querySelector("#home-view");
const detailView: HTMLElement | null = document.querySelector("#detail-view");

// Cantidad de tarjetas mostradas cuando no hay filtros.
const INITIAL_VISIBLE_COUNTRIES: number = 8;

// Conserva todos los países recibidos desde la API
let allCountries: Country[] = [];

// Temporizador utilizado por el debounce.
let searchTimer:
  ReturnType<typeof setTimeout> | undefined;


async function loadCountries(): Promise<void> {
  // Verifica que el contenedor exista antes de modificarlo.
  if (!countriesContainer) {
    console.error(
      "No se encontró #countries-container.",
    );

    return;
  }

  countriesContainer.innerHTML = renderLoading();

  try {
    // Conserva todos los países para poder filtrarlos.
    allCountries = await fetchCountries();

    if (allCountries.length === 0) {
      countriesContainer.innerHTML = renderEmpty("");
      return;
    }

    const initialCountries: Country[] =
      allCountries.slice(
        0,
        INITIAL_VISIBLE_COUNTRIES,
      );

    // Renderiza una cantidad limitada de tarjetas.
    countriesContainer.innerHTML =
      renderCountryGrid(initialCountries);

  } catch (error: unknown) {
    // Convierte el error desconocido en un mensaje seguro.
    const message: string =
      error instanceof Error
        ? error.message
        : "Ocurrió un error desconocido.";
    console.error("Error al cargar los países:", message);

    countriesContainer.innerHTML = renderError(
      "Verifica tu conexión e inténtalo nuevamente.",
    );

    const retryButton: HTMLButtonElement | null =
      document.querySelector<HTMLButtonElement>(
        "#retry-button",
      );

    retryButton?.addEventListener(
      "click",
      (): void => {
        void loadCountries();
      });
    }
  }

  function applyFilter(): void {
    // verificar que los controles y el contenedor existan
    if (
      !countrySearch ||
      !regionFilter ||
      !countriesContainer
    ) {
      return;
    }

    // obtiene el texto escrito por el usuario
    const query: string =
      countrySearch.value;

    //Obtiene la region seleccionada
    const region: string =
      regionFilter.value;

    //Aplica simultaneamente la busqueda y la region 

    const filteredCountries: Country[] =
      filterCountries(
        allCountries,
        query,
        region,
      );

    // Muestra un mensaje cuando no existen coincidencias.
    if (filteredCountries.length === 0) {
      countriesContainer.innerHTML =
        renderEmpty(query);
      return;
    }

    //Renderiza unicamente los paises que coinciden
    countriesContainer.innerHTML =
      renderCountryGrid(filteredCountries);

  }

  countrySearch?.addEventListener(
    "input",
    (): void => {
      if (searchTimer !== undefined) {
        clearTimeout(searchTimer);
      }

      searchTimer = setTimeout(
        applyFilter,
        300,
      );
    },
  );

  regionFilter?.addEventListener(
    "change",
    applyFilter
  );

  void loadCountries();

async function router(): Promise<void> {
  if (!homeView || !detailView) return;
  const hash: string = window.location.hash;
  const match: RegExpMatchArray | null =
    hash.match(/^#\/country\/([A-Za-z]{2})$/);
  if (!match) {
    homeView.hidden = false;
    detailView.hidden = true;
    return;
  }
  const code: string = match[1] ?? "";
  homeView.hidden = true;
  detailView.hidden = false;
  detailView.innerHTML = "<p>Cargando detalle del país…</p>";
  try {
    const country = await fetchCountryByCode(code);
    if (window.location.hash !== hash) return;
    detailView.innerHTML = renderDetail(country);
  } catch {
    if (window.location.hash !== hash) return;
    detailView.innerHTML =
      '<p>No fue posible cargar el país.</p><a href="#/">Volver a países</a>';
  }
}
window.addEventListener("hashchange", (): void => { void router(); });
void router(); // También atiende una URL de detalle abierta directamente.
