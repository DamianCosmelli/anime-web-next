export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.jikan.moe/v4';

export const ENDPOINTS = {
    ANIMES: `${API_BASE_URL}/anime`,
    SEASONS: `${API_BASE_URL}/seasons`,
    TOP: `${API_BASE_URL}/top/anime?limit=20`,
};
