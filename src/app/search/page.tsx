'use client';

import { useState, useEffect } from 'react';
import { animeAll, animeSearch } from '@/services/anilistService';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';
import { AnimeGrid } from '@/components/Anime/AnimeGrid';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingPuff } from '@/components/common/LoadingPuff';
import { PaginationComp } from '@/components/common/Pagination';
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const DEBOUNCE_MS = 500;

export default function AnimeSearchPage() {
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [animePagination, setAnimePagination] = useState<{
        last_visible_page: number | null;
        has_next_page: boolean;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasNextPage, setHasNextPage] = useState<boolean | undefined>(undefined);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const searching = debouncedTerm.trim() !== "";

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedTerm(searchTerm), DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedTerm]);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            try {
                const data: AnimeResponse = searching
                    ? await animeSearch(debouncedTerm, currentPage)
                    : await animeAll(currentPage);
                if (cancelled) return;
                setAnimeList(data.data ?? []);
                setAnimePagination(data.pagination);
                setHasNextPage(data.pagination?.has_next_page);
                setError(null);
            } catch (err) {
                if (!cancelled) setError((err as Error).message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };
        fetchData();
        return () => {
            cancelled = true;
        };
    }, [debouncedTerm, currentPage, searching]);

    const handleSearch = () => {
        setDebouncedTerm(searchTerm);
        setCurrentPage(1);
    };

    const handleReload = () => {
        setSearchTerm("");
        setDebouncedTerm("");
        setCurrentPage(1);
    };

    if (loading) return <LoadingPuff />;
    if (error) return <ErrorMessage error={error} />;

    const notFound = searching && animeList.length === 0;

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
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Pagination or Back button */}
            <div className="px-4 sm:px-6 lg:px-8 pb-4">
                {searching ? (
                    <button
                        onClick={handleReload}
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        <ArrowPathIcon className="w-4 h-4" />
                        Volver al catálogo
                    </button>
                ) : (
                    animePagination && (
                        <PaginationComp
                            currentPage={currentPage}
                            lastPage={animePagination.last_visible_page}
                            setCurrentPage={setCurrentPage}
                            hasNextPage={hasNextPage}
                            setHasNextPage={setHasNextPage}
                        />
                    )
                )}
            </div>

            {/* Results */}
            {notFound ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg">No se encontraron resultados para &quot;{debouncedTerm}&quot;</p>
                </div>
            ) : (
                <>
                    <AnimeGrid animeList={animeList} />
                    {searching && animePagination && animeList.length > 0 && (
                        <div className="px-4 sm:px-6 lg:px-8 py-4">
                            <PaginationComp
                                currentPage={currentPage}
                                lastPage={animePagination.last_visible_page}
                                setCurrentPage={setCurrentPage}
                                hasNextPage={hasNextPage}
                                setHasNextPage={setHasNextPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
