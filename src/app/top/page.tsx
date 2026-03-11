'use client';

import { useState, useEffect } from 'react';
import { animeTop } from '@/services/animeService';
import { Anime } from '@/types/anime';
import { AnimeResponse } from '@/types/animeResponse';
import AnimeTableTop from '@/components/Anime/AnimeTableTop';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { LoadingPuff } from '@/components/common/LoadingPuff';
import { TrophyIcon } from '@heroicons/react/24/outline';

export default function AnimeTopPage() {
    const [animeListTop, setAnimeListTop] = useState<Anime[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getAnimeTop = async () => {
            try {
                const data: AnimeResponse = await animeTop();
                const uniqueAnime = Array.from(new Map(data.data.map((anime: Anime) => [anime.rank, anime])).values())
                    .sort((a, b) => a.rank - b.rank)
                    .slice(0, 15);
                setAnimeListTop(uniqueAnime);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        getAnimeTop();
    }, []);

    if (loading) return <LoadingPuff />;
    if (error) return <ErrorMessage message={error} />;

    if (!animeListTop || animeListTop.length === 0) {
        return <ErrorMessage message="No se encontraron resultados en la consulta." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <TrophyIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Top Anime
                    </h1>
                </div>
                <p className="text-gray-400">Los anime mejor valorados de todos los tiempos</p>
            </div>

            {/* Table */}
            <AnimeTableTop animeList={animeListTop} />
        </div>
    );
}
