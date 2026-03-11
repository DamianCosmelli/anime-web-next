'use client';

import { useState, useEffect } from 'react';
import { animeSeason } from '@/services/animeService';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';
import { PaginationComp } from '@/components/common/Pagination';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AnimeGrid } from '@/components/Anime/AnimeGrid';
import { AnimeSelectSeason } from '@/components/Anime/Titulos/AnimeSelectSeason';
import { LoadingPuff } from '@/components/common/LoadingPuff';
import { getSeasonName, Seasons } from '@/utils/seasonConverts';
import { SelectSeasonFormData } from '@/schema/SelectSeasonSchema';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

function getSeasonYear() {
    const date = new Date();
    const year = date.getFullYear();
    const seasonYears = [year + 1, year, year - 1, year - 2];
    return seasonYears.reduce((acc, curr) => {
        acc[curr.toString()] = curr.toString();
        return acc;
    }, {} as Record<string, string>);
}

function actualYear(): string {
    const fechaActual = new Date();
    return fechaActual.getFullYear().toString();
}

function SeasonXDate(): string {
    const fechaActual = new Date();
    const mes = fechaActual.getMonth();
    if (mes >= 0 && mes <= 2) return "winter";
    if (mes >= 3 && mes <= 5) return "spring";
    if (mes >= 6 && mes <= 8) return "summer";
    if (mes >= 9 && mes <= 11) return "fall";
    return "";
}

export default function AnimeSeasonPage() {
    const [seleccion, setSelection] = useState<{ season: string; seasonYear: string }>({
        season: SeasonXDate(),
        seasonYear: actualYear()
    });
    const [titulo, setTitulo] = useState<string>("Anime de la Temporada " + getSeasonName(SeasonXDate()) + " del " + actualYear());

    const [animeSeasonList, setAnimeSeasonList] = useState<Anime[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [animePagination, setAnimePagination] = useState<{
        last_visible_page: number;
        has_next_page: boolean;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const getAnimeSeason = async () => {
            setLoading(true);
            try {
                const data: AnimeResponse = await animeSeason(seleccion.season, seleccion.seasonYear, currentPage);
                const uniqueAnime = Array.from(new Map(data.data.map((anime: Anime) => [anime.mal_id, anime])).values());
                setAnimeSeasonList(uniqueAnime);
                setAnimePagination(data.pagination);
                setHasNextPage(data.pagination?.has_next_page);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        getAnimeSeason();
    }, [seleccion.season, seleccion.seasonYear, currentPage]);

    useEffect(() => {
        setTitulo("Anime de la Temporada " + getSeasonName(seleccion.season) + " del " + seleccion.seasonYear);
    }, [seleccion]);

    const handleFormSubmit = (data: SelectSeasonFormData) => {
        setSelection({ season: data.season, seasonYear: data.seasonYear });
    };

    if (loading) return <LoadingPuff />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <CalendarDaysIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Temporadas
                    </h1>
                </div>
                <p className="text-gray-400">Explora los anime por temporada</p>
            </div>

            {/* Season Selector */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Temporada</h3>
                    <AnimeSelectSeason
                        seasons={Seasons}
                        years={getSeasonYear()}
                        onSubmit={handleFormSubmit}
                        defaultSeason={seleccion.season}
                        defaultYear={seleccion.seasonYear}
                    />
                </div>
            </div>

            {/* Title */}
            <div className="px-4 sm:px-6 lg:px-8 pb-4">
                <h2 className="text-xl font-bold text-white">{titulo}</h2>
            </div>

            {/* Pagination */}
            {animePagination && (
                <div className="px-4 sm:px-6 lg:px-8 pb-4">
                    <PaginationComp
                        currentPage={currentPage}
                        lastPage={animePagination.last_visible_page}
                        setCurrentPage={setCurrentPage}
                        hasNextPage={hasNextPage}
                        setHasNextPage={setHasNextPage}
                    />
                </div>
            )}

            {/* Grid */}
            <AnimeGrid animeList={animeSeasonList ?? []} />
        </div>
    );
}
