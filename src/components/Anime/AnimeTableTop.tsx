'use client';

import { Anime } from '@/types/anime';
import { AnimeInfoModal } from './AnimeInfoModal';

const TABLE_HEAD = ["#", "Portada", "Título", "Puntuación", ""];

const AnimeTableTop = ({ animeList }: { animeList: Anime[] }) => {
    return (
        <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-800/50">
                            {TABLE_HEAD.map((head, index) => (
                                <th 
                                    key={head} 
                                    className={`px-4 py-3 text-start text-sm font-semibold text-gray-400 uppercase tracking-wider ${
                                        index === 0 ? 'w-16' : ''
                                    }`}
                                >
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {animeList && animeList.map((anime: Anime, index: number) => (
                            <tr 
                                key={anime.mal_id} 
                                className="hover:bg-gray-800/30 transition-colors"
                            >
                                <td className="p-4">
                                    <span className={`text-2xl font-bold ${
                                        index === 0 ? 'text-yellow-400' :
                                        index === 1 ? 'text-gray-300' :
                                        index === 2 ? 'text-amber-600' :
                                        'text-gray-500'
                                    }`}>
                                        {anime.rank}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="relative w-16 h-24 overflow-hidden rounded-lg">
                                        <img 
                                            src={anime.images.jpg.small_image_url} 
                                            alt={anime.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <h3 className="text-white font-semibold line-clamp-2">{anime.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                                        <span>{anime.type}</span>
                                        {anime.episodes && <span>{anime.episodes} eps</span>}
                                        {anime.year && <span>{anime.year}</span>}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-lg font-bold text-yellow-400">{anime.score}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <AnimeInfoModal anime={anime} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnimeTableTop;
