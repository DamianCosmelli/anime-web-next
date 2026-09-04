import { Anime } from './anime';

export interface Pagination {
    // null = total desconocido (la API topa/estima el total): no mostrar "/ N".
    last_visible_page: number | null;
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
