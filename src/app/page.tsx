'use client';

import { useState, useEffect } from 'react';
import { animeTv } from '@/services/animeService';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { AnimeGrid } from '@/components/Anime/AnimeGrid';
import { LoadingPuff } from '@/components/common/LoadingPuff';
import { PaginationComp } from '@/components/common/Pagination';
import { TvIcon } from '@heroicons/react/24/outline';

export default function AnimeOnTv() {
    const [animeList, setAnimeList] = useState<Anime[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [animePagination, setAnimePagination] = useState<{
        last_visible_page: number;
        has_next_page: boolean;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const getAnime = async () => {
            setLoading(true);
            try {
                const data: AnimeResponse = await animeTv(currentPage);
                const uniqueAnime = Array.from(new Map(data.data.map((anime: Anime) => [anime.mal_id, anime])).values());
                setAnimeList(uniqueAnime);
                setAnimePagination(data.pagination);
                setHasNextPage(data.pagination?.has_next_page);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        getAnime();
    }, [currentPage]);

    if (loading) return <LoadingPuff />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <TvIcon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Anime en Emisión
                    </h1>
                </div>
                <p className="text-gray-400">Descubre los anime que se están emitiendo actualmente</p>
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
            <AnimeGrid animeList={animeList ?? []} />
        </div>
    );
}
