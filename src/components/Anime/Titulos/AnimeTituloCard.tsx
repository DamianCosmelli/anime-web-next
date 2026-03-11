'use client';

import { Anime } from '@/types/anime';

export const AnimeTituloCard: React.FC<{ anime: Anime }> = ({ anime }) => {
    return (
        <div className="relative w-full h-64 overflow-hidden rounded-xl">
            <img
                className="w-full h-full object-cover"
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
                <h5 className="font-bold text-white text-sm line-clamp-2 leading-tight">
                    {anime.title}
                </h5>
                <div className="flex items-center gap-2 mt-1">
                    {anime.episodes && (
                        <span className="text-xs text-gray-300">
                            {anime.episodes} eps
                        </span>
                    )}
                    {anime.score > 0 && (
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {anime.score}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
