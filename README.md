# Explorer App 🌎

Aplicación web para explorar países, buscar por nombre, filtrar por región y consultar información de cada país. Desarrollada como proyecto académico de la asignatura Diseño Web Adaptable de la Universidad de Oriente (UNIVO).

Esta demo docente utiliza una copia estática de los datos de REST Countries para reducir el consumo de la API. Los datos no se actualizan automáticamente.

## Tecnologías

- **Vite:** entorno de desarrollo y compilación.
- **TypeScript:** lógica de la aplicación con tipado.
- **Tailwind CSS v4:** estilos y diseño adaptable.
- **REST Countries API v5:** datos y banderas de los países.
- **GitHub:** control de versiones y Pull Requests.
- **Vercel:** publicación y previews.

## Funciones implementadas

- Listado de países con bandera, nombre, población, región y capital.
- Búsqueda por nombre y filtro por región.
- Debounce de 300 ms para la búsqueda.
- Estados de carga, skeleton, resultados vacíos y error.
- Vista de detalle con navegación SPA mediante hash routing.
- Tarjetas adaptables mediante Container Queries.
- Tipografía fluida con `clamp()`.
- Navegación con teclado y foco visible en el enlace “Ver más”.

## Instalación

Necesitas Node.js y pnpm.

Clona el repositorio:

```bash
git clone https://github.com/Kcruz080492/ExplorerApp.git
cd ExplorerApp
```

Instala las dependencias:

```bash
pnpm install
```

## Configuración de la API

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_REST_COUNTRIES_API_KEY=TU_CLAVE_DE_API
```

Sustituye el valor de ejemplo por tu clave de REST Countries. El archivo `.env` debe permanecer fuera del repositorio.

En la configuración de la clave, autoriza los hostnames desde los que ejecutarás la aplicación: localhost, producción y la preview que utilizarás.

Las variables con prefijo `VITE_` se incorporan al código del navegador; este mecanismo no mantiene privada una clave.

## Ejecutar en desarrollo

```bash
pnpm dev
```

Abre la dirección que indique la terminal.

## Generar el build

```bash
pnpm build
```

Este comando genera los archivos de producción en la carpeta `dist`.

Para revisar el build localmente:

```bash
pnpm preview
```

## Publicación en Vercel

El proyecto está conectado al repositorio de GitHub con esta configuración:

- **Framework:** Vite.
- **Build Command:** `pnpm build`.
- **Output Directory:** `dist`.
- **Rama de producción:** `main`.
- **Variable de entorno:** `VITE_REST_COUNTRIES_API_KEY`, configurada para Production y Preview.

Las ramas de trabajo permiten revisar los cambios en una preview antes de integrarlos mediante un Pull Request.

## Enlaces

- [Aplicación en producción](https://explorer-app-eight.vercel.app)
- [Repositorio en GitHub](https://github.com/Kcruz080492/ExplorerApp)
- [Pull Request #1: mejora del foco visible](https://github.com/Kcruz080492/ExplorerApp/pull/1)
- [Preview de la mejora](https://explorer-app-git-fix-card-link-focus-kcruz.vercel.app/)

## Mejora publicada en la sesión 19

Se ajustó el foco visible del enlace “Ver más”:

- Separación del contorno de 2 a 4 px.
- Color del contorno de `blue-500` a `blue-600`.

El cambio se realizó en la rama `fix/card-link-focus`, se revisó en una preview y se integró a `main` mediante el Pull Request #1.

## Consideraciones

La carga de países depende de la disponibilidad de REST Countries, de la cuota de la clave y de sus orígenes permitidos. Una dirección nueva de preview puede requerir autorización en la configuración de la API.

## Autora

Karla Cecilia Cruz  
Diseño Web Adaptable — Universidad de Oriente, UNIVO.