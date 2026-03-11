'use client';

import { Anime } from '@/types/anime';
import { AnimeInfoModalAndCard } from './AnimeInfoModalAndCard';

interface AnimeGridProps {
    animeList: Anime[];
}

export const AnimeGrid = ({ animeList }: AnimeGridProps) => {
    if (!animeList || animeList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="text-6xl mb-4">😢</div>
                <p className="text-gray-500 text-lg">No se encontraron anime</p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {animeList.map((anime: Anime) => (
                    <div key={anime.mal_id} className="flex justify-center">
                        <AnimeInfoModalAndCard anime={anime} />
                    </div>
                ))}
            </div>
        </div>
    );
};
