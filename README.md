# AnimeWeb 🎬

Una aplicación web moderna para explorar anime, construida con Next.js y la API de Jikan (MyAnimeList).

## Características

- **Anime en Emisión**: Ver los anime que se están emitiendo actualmente
- **Explorar por Temporada**: Navega anime por temporada y año
- **Búsqueda**: Encuentra anime por nombre
- **Top Anime**: Descubre los anime mejor valorados
- **Detalles de Anime**: Ver información completa incluyendo sinopsis y trailer
- **Traducción de Sinopsis**: Traducción automática al español (mediante MyMemory API)

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **API**: Jikan API (MyAnimeList)
- **Traducción**: MyMemory API
- **Despliegue**: GitHub Pages

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd anime-web-next

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### Desarrollo Local

Cuando ejecutas `npm run dev` localmente, la aplicación corre en `http://localhost:3000/` sin basePath. 

**Nota importante sobre basePath:**
- **En desarrollo local**: El archivo `next.config.ts` tiene `basePath: '/anime-web-next'` configurado permanentemente
- Si necesitas probar sin basePath en local, puedes:
  1. Cambiar temporalmente `basePath` en `next.config.ts` a una cadena vacía `''`
  2. O crear una variable de entorno para desarrollo local

Las rutas internas usan la variable `BASE_PATH` definida en `MainLayout.tsx` que referencia el basePath configurado.

## Despliegue en GitHub Pages

```bash
# Hacer build y desplegar
npm run deploy
```

Este comando:
1. Ejecuta `npm run build` (predeploy)
2. Publica el directorio `out` en la rama `gh-pages`

La aplicación estará disponible en: `https://tu-usuario.github.io/anime-web-next/`

### Requisitos previos

1. Crear un repositorio en GitHub con el nombre `anime-web-next`
2. El repositorio debe tener GitHub Pages habilitado (Settings → Pages → Source: gh-pages)

## Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Página principal (Anime en Emisión)
│   ├── search/            # Página de búsqueda
│   ├── temporada/         # Página de temporadas
│   └── top/              # Página de top anime
├── components/            # Componentes React
│   ├── Anime/            # Componentes de anime
│   ├── common/           # Componentes compartidos
│   └── Layout/           # Layout principal
├── services/             # Servicios API
├── types/                # Tipos TypeScript
└── utils/                # Utilidades
```

## Variables de Entorno

```env
NEXT_PUBLIC_API_BASE_URL=https://api.jikan.moe/v4
```

## Licencia

MIT © 2025 AnimeWeb - Datos proporcionados por [Jikan API](https://jikan.moe/)
