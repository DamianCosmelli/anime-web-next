import { ENDPOINTS } from '@/config/api';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';

export const LOCAL_PAGE_SIZE = 12;

const REQUEST_GAP_MS = 400;

class FetchError extends Error {
    status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetching = async (url: string, retryOnRateLimit = true) => {
    const response = await fetch(url);
    if (response.status === 429 && retryOnRateLimit) {
        await delay(1200);
        const retry = await fetch(url);
        if (!retry.ok) {
            throw new FetchError(`Error fetching data (${retry.status})`, retry.status);
        }
        return retry.json();
    }
    if (!response.ok) {
        throw new FetchError(`Error fetching data (${response.status})`, response.status);
    }
    return response.json();
};

// Todas las URLs van SIN query-params (Jikan devuelve 504 con ?...).
// Se combinan varias fuentes para pasar de 25 a ~50-75 animes por vista.
const fetchPool = async (urls: string[]): Promise<Anime[]> => {
    const collected: Anime[] = [];
    for (const url of urls) {
        try {
            const raw: AnimeResponse = await fetching(url);
            if (Array.isArray(raw.data)) collected.push(...raw.data);
        } catch {
            // Una fuente caída no vacía el resto del pool.
        }
        await delay(REQUEST_GAP_MS);
    }
    return dedupe(collected);
};

const toLocalResponse = (data: Anime[]): AnimeResponse => ({
    data,
    pagination: {
        last_visible_page: Math.max(1, Math.ceil(data.length / LOCAL_PAGE_SIZE)),
        has_next_page: data.length > LOCAL_PAGE_SIZE,
        current_page: 1,
        items: {
            count: data.length,
            total: data.length,
            per_page: LOCAL_PAGE_SIZE,
        },
    },
});

const dedupe = (list: Anime[]): Anime[] =>
    Array.from(new Map(list.map((anime) => [anime.mal_id, anime])).values());

const isAiring = (a: Anime): boolean =>
    a.airing === true || a.status?.toLowerCase().includes('currently airing') === true;

export const animeTv = async (): Promise<AnimeResponse> => {
    const pool = await fetchPool([ENDPOINTS.SEASONS_NOW, ENDPOINTS.ANIMES]);
    const filtered = pool
        .filter((a) => a.type === 'TV' && isAiring(a))
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return toLocalResponse(filtered);
};

export const animeSearch = async (name: string): Promise<AnimeResponse> => {
    const q = name.trim().toLowerCase();
    const pool = await fetchPool([ENDPOINTS.ANIMES, ENDPOINTS.TOP, ENDPOINTS.SEASONS_NOW]);
    if (!q) return toLocalResponse(pool);
    const rawQuery = name.trim();
    const filtered = pool.filter(
        (a) =>
            a.title?.toLowerCase().includes(q) ||
            a.title_english?.toLowerCase().includes(q) ||
            a.title_japanese?.includes(rawQuery) ||
            a.synopsis?.toLowerCase().includes(q)
    );
    return toLocalResponse(filtered);
};

export const animeSeason = async (
    season: string,
    seasonYear: string = new Date().getFullYear().toString()
): Promise<AnimeResponse> => {
    const pool = await fetchPool([
        `${ENDPOINTS.SEASONS}/${seasonYear}/${season}`,
        ENDPOINTS.SEASONS_NOW,
        ENDPOINTS.ANIMES,
    ]);
    const inSeason = pool.filter(
        (a) => a.season?.toLowerCase() === season.toLowerCase() && String(a.year) === String(seasonYear)
    );
    const tvOnly = inSeason.filter((a) => a.type === 'TV');
    // Fallback sin filtro type TV si dejaría la lista vacía.
    return toLocalResponse(tvOnly.length > 0 ? tvOnly : inSeason);
};

export const animeTop = async (): Promise<AnimeResponse> => {
    return fetching(ENDPOINTS.TOP);
};

export const animeAll = async (): Promise<AnimeResponse> => {
    const pool = await fetchPool([ENDPOINTS.ANIMES, ENDPOINTS.TOP, ENDPOINTS.SEASONS_NOW]);
    return toLocalResponse(pool);
};
