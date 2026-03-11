'use client';

import { Seasons } from "@/utils/seasonConverts";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectSeasonSchema, SelectSeasonFormData } from '@/schema/SelectSeasonSchema';
import { useEffect } from "react";

export const AnimeSelectSeason = ({
    seasons,
    years,
    onSubmit,
    defaultSeason,
    defaultYear
}: {
    seasons: Record<string, string>;
    years: Record<string, string>;
    onSubmit: (data: SelectSeasonFormData) => void;
    defaultSeason?: string;
    defaultYear?: string;
}) => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<SelectSeasonFormData>({
        resolver: zodResolver(selectSeasonSchema),
    });

    useEffect(() => {
        setValue("season", defaultSeason || "winter");
        setValue("seasonYear", defaultYear || new Date().getFullYear().toString());
    }, [defaultSeason, defaultYear, setValue]);

    return (
        <form className="flex flex-col sm:flex-row gap-4 items-end" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex-1 w-full">
                <label htmlFor="season" className="block text-sm font-medium text-gray-400 mb-2">Temporada</label>
                <select
                    id="season"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    {...register("season")}
                    onChange={e => setValue("season", e.target.value)}
                >
                    {(Object.keys(seasons) as Array<keyof typeof Seasons>).map((key) => (
                        <option key={key} value={key} className="bg-gray-800">
                            {Seasons[key]}
                        </option>
                    ))}
                </select>
                {errors.season && <p className="text-red-500 text-sm mt-1">{errors.season.message}</p>}
            </div>

            <div className="flex-1 w-full">
                <label htmlFor="seasonYear" className="block text-sm font-medium text-gray-400 mb-2">Año</label>
                <select 
                    id="seasonYear" 
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    {...register("seasonYear")}
                >
                    {Object.entries(years)
                        .sort((a, b) => Number(b[0]) - Number(a[0]))
                        .map(([key, value]) => (
                            <option key={key} value={key} className="bg-gray-800">
                                {value}
                            </option>
                        ))}
                </select>
                {errors.seasonYear && <p className="text-red-500 text-sm mt-1">{errors.seasonYear.message}</p>}
            </div>

            <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
                <MagnifyingGlassIcon className="w-5 h-5" />
                Buscar
            </button>
        </form>
    );
};
