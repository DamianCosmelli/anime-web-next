'use client';

import { useState, useEffect } from 'react';
import { animeSearch, animeAll } from '@/services/animeService';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';
import { AnimeGrid } from '@/components/Anime/AnimeGrid';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingPuff } from '@/components/common/LoadingPuff';
import { PaginationComp } from '@/components/common/Pagination';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function AnimeSearchPage() {
    const [animeList, setAnimeList] = useState<Anime[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [animePagination, setAnimePagination] = useState<{
        last_visible_page: number;
        has_next_page: boolean;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);

    const [animeListUpdated, setAnimeListUpdated] = useState<Anime[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searching, setSearching] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const getAnimeAll = async () => {
            setLoading(true);
            try {
                const data: AnimeResponse = await animeAll(currentPage);
                const uniqueAnime = Array.from(new Map(data.data.map((anime: Anime) => [anime.mal_id, anime])).values());
                setAnimeList(uniqueAnime);
                setAnimeListUpdated(uniqueAnime);
                setAnimePagination(data.pagination);
                setHasNextPage(data.pagination?.has_next_page);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        getAnimeAll();
    }, [currentPage]);

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;
        
        setLoading(true);
        try {
            const filteredAnime: AnimeResponse = await animeSearch(searchTerm);
            const uniqueAnime = Array.from(new Map(filteredAnime.data.map((anime: Anime) => [anime.mal_id, anime])).values());
            const filtered = uniqueAnime.filter(anime => anime.title.toLowerCase().includes(searchTerm.toLowerCase()));
            setAnimeListUpdated(filtered);
            setCurrentPage(1);
            setHasNextPage(false);
            setSearching(true);
            setNotFound(filtered.length === 0);
        } catch (err) {
            setAnimeListUpdated([]);
            setNotFound(true);
            setSearching(true);
        } finally {
            setLoading(false);
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    if (loading) return <LoadingPuff />;
    if (error) return <ErrorMessage error={error} />;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <MagnifyingGlassIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Buscar Anime
                    </h1>
                </div>
                <p className="text-gray-400">Encuentra tu anime favorito</p>
            </div>

            {/* Search Bar */}
            <div className="px-4 sm:px-6 lg:px-8 pb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar anime..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                    await handleSearch();
                                }
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <MagnifyingGlassIcon className="w-5 h-5" />
                        Buscar
                    </button>
                </div>
            </div>

            {/* Pagination or Back button */}
            <div className="px-4 sm:px-6 lg:px-8 pb-4">
                {animePagination && !searching ? (
                    <PaginationComp
                        currentPage={currentPage}
                        lastPage={animePagination.last_visible_page}
                        setCurrentPage={setCurrentPage}
                        hasNextPage={hasNextPage}
                        setHasNextPage={setHasNextPage}
                    />
                ) : (
                    <button
                        onClick={handleReload}
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Volver al catálogo
                    </button>
                )}
            </div>

            {/* Results */}
            {notFound && searching ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">No se encontraron resultados para "{searchTerm}"</p>
                </div>
            ) : (
                <AnimeGrid animeList={animeListUpdated ?? []} />
            )}
        </div>
    );
}
