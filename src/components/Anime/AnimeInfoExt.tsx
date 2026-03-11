'use client';

import { useState } from 'react';
import { Anime } from '@/types/anime';
import { getSeasonName } from '@/utils/seasonConverts';
import { translateText } from '@/services/translationService';

interface AnimeInfoExtProps {
    anime: Anime;
}

export const AnimeInfoExt = ({ anime }: AnimeInfoExtProps) => {
    const [synopsis, setSynopsis] = useState<string>(anime.synopsis || "No disponible");
    const [isTranslated, setIsTranslated] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        setIsTranslating(true);
        setError(null);
        
        try {
            const translated = await translateText(anime.synopsis || "");
            console.log('Translated result:', translated);
            
            if (translated && translated !== anime.synopsis) {
                setSynopsis(translated);
                setIsTranslated(true);
            } else {
                setError('No se pudo traducir la sinopsis, probá más tarde');
            }
        } catch (err) {
            console.error('Translation error:', err);
            setError('Error al traducir');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleShowOriginal = () => {
        setSynopsis(anime.synopsis || "No disponible");
        setIsTranslated(false);
        setError(null);
    };
    
    return (
        <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col">
            <div className="flex flex-col md:flex-row h-full">
                {/* Imagen */}
                <div className="w-full md:w-2/5 flex-shrink-0">
                    <img
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        className="w-full h-48 md:h-full object-cover"
                    />
                </div>

                {/* Contenido */}
                <div className="w-full md:w-3/5 p-4 md:p-6 text-white flex flex-col overflow-hidden">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex-shrink-0">
                        {anime.title_english || anime.title_japanese || anime.title}
                    </h2>

                    <div className="space-y-2 mb-4 flex-shrink-0">
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                                {anime.type || "N/A"}
                            </span>
                            {anime.episodes && (
                                <span className="text-gray-400">{anime.episodes} episodios</span>
                            )}
                            {anime.year && (
                                <span className="text-gray-400">{anime.year}</span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {anime.score > 0 && (
                                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 rounded-full">
                                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-bold text-yellow-400">{anime.score}</span>
                                </div>
                            )}
                            {anime.season && (
                                <span className="text-gray-400 text-sm">
                                    {getSeasonName(anime.season)} {anime.year}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Sinopsis con scroll */}
                    <div className="mb-4 flex-1 overflow-hidden flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-2 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sinopsis</h3>
                                {/* Tooltip de traducción */}
                                {isTranslated && (
                                    <span 
                                        className="text-xs text-gray-500 italic cursor-help border-b border-dotted border-gray-500"
                                        title="Traducción automática mediante MyMemory API. Puede contener errores."
                                    >
                                        (traducido)
                                    </span>
                                )}
                            </div>
                            {/* Link de traducción a la derecha */}
                            <button
                                onClick={isTranslated ? handleShowOriginal : handleTranslate}
                                disabled={isTranslating}
                                className="text-xs text-cyan-400 hover:text-cyan-300 underline disabled:opacity-50 whitespace-nowrap"
                            >
                                {isTranslated ? "Ver en inglés" : isTranslating ? "Traduciendo..." : "Traducir al español"}
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-2">
                            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                {synopsis}
                            </p>
                        </div>
                        
                        {error && (
                            <p className="text-xs text-red-400 mt-2 flex-shrink-0">{error}</p>
                        )}
                    </div>

                    {/* Trailer */}
                    {anime.trailer?.url && (
                        <a
                            href={anime.trailer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-full font-semibold text-sm transition-all flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Ver Trailer
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
