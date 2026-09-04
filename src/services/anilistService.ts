import { ANILIST_URL } from '@/config/api';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';

export const ANILIST_PER_PAGE = 24;

interface AnilistTitle {
    romaji?: string | null;
    english?: string | null;
    native?: string | null;
}

interface AnilistMedia {
    id: number;
    idMal?: number | null;
    title?: AnilistTitle | null;
    coverImage?: { large?: string | null; medium?: string | null } | null;
    trailer?: { id?: string | null; site?: string | null; thumbnail?: string | null } | null;
    episodes?: number | null;
    duration?: number | null;
    format?: string | null;
    source?: string | null;
    status?: string | null;
    season?: string | null;
    seasonYear?: number | null;
    startDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
    averageScore?: number | null;
    rankings?: { rank?: number | null; type?: string | null; allTime?: boolean | null }[] | null;
    description?: string | null;
}

interface AnilistPageInfo {
    total?: number | null;
    currentPage?: number | null;
    lastPage?: number | null;
    hasNextPage?: boolean | null;
    perPage?: number | null;
}

const MEDIA_QUERY = `
query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $format: MediaFormat, $status: MediaStatus, $sort: [MediaSort], $search: String) {
    Page(page: $page, perPage: $perPage) {
        pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media(season: $season, seasonYear: $seasonYear, format: $format, status: $status, sort: $sort, search: $search, type: ANIME, isAdult: false) {
            id
            idMal
            title { romaji english native }
            coverImage { large medium }
            trailer { id site thumbnail }
            episodes
            duration
            format
            source
            status
            season
            seasonYear
            startDate { year month day }
            averageScore
            rankings { rank type allTime }
            description
        }
    }
}
`;

const stripHtml = (html?: string | null): string =>
    (html ?? '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]*>/g, '')
        .replace(/\s+/g, ' ')
        .trim();

const mapStatus = (status?: string | null): string => {
    switch (status) {
        case 'RELEASING':
            return 'Currently Airing';
        case 'FINISHED':
            return 'Finished Airing';
        case 'NOT_YET_RELEASED':
            return 'Not yet aired';
        case 'HIATUS':
            return 'Currently Airing';
        default:
            return 'Finished Airing';
    }
};

const mapType = (format?: string | null): string => {
    switch (format) {
        case 'TV':
        case 'TV_SHORT':
            return 'TV';
        case 'MOVIE':
            return 'Movie';
        case 'OVA':
            return 'OVA';
        case 'ONA':
            return 'ONA';
        case 'SPECIAL':
            return 'Special';
        case 'MUSIC':
            return 'Music';
        default:
            return 'TV';
    }
};

const mapMedia = (m: AnilistMedia): Anime => {
    const start = m.startDate ?? {};
    const airedString =
        start.year != null
            ? `${start.year}-${String(start.month ?? 1).padStart(2, '0')}-${String(start.day ?? 1).padStart(2, '0')}`
            : '';
    const trailerId = m.trailer?.id ?? null;
    const trailerUrl =
        m.trailer?.site === 'youtube' && trailerId
            ? `https://www.youtube.com/watch?v=${trailerId}`
            : (m.trailer?.thumbnail ?? '');
    const imageLarge = m.coverImage?.large ?? '';
    const imageMedium = m.coverImage?.medium ?? imageLarge;
    const rank =
        m.rankings?.find((r) => r.type === 'RATED' && r.allTime)?.rank ??
        m.rankings?.[0]?.rank ??
        0;

    return {
        mal_id: m.idMal ?? m.id,
        url: m.idMal ? `https://myanimelist.net/anime/${m.idMal}` : `https://anilist.co/anime/${m.id}`,
        images: {
            jpg: {
                image_url: imageMedium,
                small_image_url: imageMedium,
                large_image_url: imageLarge,
            },
        },
        trailer: {
            youtube_id: m.trailer?.site === 'youtube' ? trailerId : null,
            url: trailerUrl,
            embed_url: m.trailer?.site === 'youtube' && trailerId ? `https://www.youtube.com/embed/${trailerId}` : undefined,
            images: m.trailer?.thumbnail ? { image_url: m.trailer.thumbnail } : undefined,
        },
        title: m.title?.romaji ?? m.title?.english ?? '',
        title_english: m.title?.english ?? '',
        title_japanese: m.title?.native ?? '',
        episodes: m.episodes ?? 0,
        duration: m.duration != null ? `${m.duration} min` : '',
        type: mapType(m.format),
        source: m.source ?? '',
        demographics: { name: '' },
        status: mapStatus(m.status),
        airing: m.status === 'RELEASING',
        aired: { string: airedString },
        rating: 0,
        score: m.averageScore != null ? m.averageScore / 10 : 0,
        rank: rank ?? 0,
        synopsis: stripHtml(m.description),
        season: (m.season ?? '').toLowerCase(),
        year: m.seasonYear ?? start.year ?? 0,
    };
};

interface QueryVars {
    page?: number;
    season?: string;
    seasonYear?: number;
    format?: string;
    status?: string;
    sort?: string[];
    search?: string;
}

const queryMedia = async (vars: QueryVars): Promise<AnimeResponse> => {
    const page = vars.page && vars.page > 0 ? vars.page : 1;
    // AniList trata los nulls explícitos como filtro (devuelve vacío):
    // se omiten las claves sin valor para que el argumento no se envíe.
    const variables: Record<string, unknown> = {
        page,
        perPage: ANILIST_PER_PAGE,
    };
    if (vars.season) variables.season = vars.season;
    if (vars.seasonYear) variables.seasonYear = vars.seasonYear;
    if (vars.format) variables.format = vars.format;
    if (vars.status) variables.status = vars.status;
    if (vars.sort) variables.sort = vars.sort;
    if (vars.search) variables.search = vars.search;
    const response = await fetch(ANILIST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            query: MEDIA_QUERY,
            variables,
        }),
    });
    if (!response.ok) {
        throw new Error(`Error fetching data (${response.status})`);
    }
    const json = await response.json();
    if (Array.isArray(json.errors) && json.errors.length > 0) {
        throw new Error(`Error fetching data (${json.errors[0]?.message ?? 'graphQL error'})`);
    }
    const pageData = json.data?.Page;
    const media: AnilistMedia[] = pageData?.media ?? [];
    const info: AnilistPageInfo = pageData?.pageInfo ?? {};
    // pageInfo.total de AniList está topado en 5000 y en búsquedas varía
    // entre páginas: el único final fiable es una página corta/vacía.
    const pageIsFull = media.length >= ANILIST_PER_PAGE;
    const hasNext = info.hasNextPage === true && pageIsFull;
    return {
        data: media.map(mapMedia),
        pagination: {
            // null = total desconocido (no inventar números): solo se conoce
            // el final exacto cuando ya no hay página siguiente.
            last_visible_page: hasNext ? null : page,
            has_next_page: hasNext,
            current_page: info.currentPage ?? page,
            items: {
                count: media.length,
                total: info.total ?? media.length,
                per_page: info.perPage ?? ANILIST_PER_PAGE,
            },
        },
    };
};

const toSeasonEnum = (season: string): string | undefined => {
    const s = season.trim().toUpperCase();
    return s === 'WINTER' || s === 'SPRING' || s === 'SUMMER' || s === 'FALL' ? s : undefined;
};

export const animeTv = async (page = 1): Promise<AnimeResponse> =>
    queryMedia({ page, format: 'TV', status: 'RELEASING', sort: ['SCORE_DESC'] });

export const animeSeason = async (
    season: string,
    seasonYear: string = new Date().getFullYear().toString(),
    page = 1
): Promise<AnimeResponse> =>
    queryMedia({
        page,
        season: toSeasonEnum(season),
        seasonYear: Number(seasonYear),
        format: 'TV',
        sort: ['POPULARITY_DESC'],
    });

export const animeSearch = async (name: string, page = 1): Promise<AnimeResponse> => {
    const q = name.trim();
    if (!q) return animeAll(page);
    return queryMedia({ page, search: q, sort: ['SEARCH_MATCH'] });
};

export const animeAll = async (page = 1): Promise<AnimeResponse> =>
    queryMedia({ page, sort: ['POPULARITY_DESC'] });
