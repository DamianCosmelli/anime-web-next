import { Anime } from './anime';

export interface Pagination {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number | null;
    items: {
        count: number;
        total: number;
        per_page: number;
    };
}

export interface AnimeResponse {
    data: Anime[];
    pagination: Pagination;
}
