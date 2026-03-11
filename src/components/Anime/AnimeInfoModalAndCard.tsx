'use client';

import { useState, MouseEvent } from "react";
import { Modal } from "../common/Modal";
import { AnimeInfoExt } from './AnimeInfoExt';
import { AnimeTituloCard } from "./Titulos/AnimeTituloCard";
import { Anime } from '@/types/anime';

export const AnimeInfoModalAndCard = ({ anime }: { anime: Anime }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    return (
        <>
            <div 
                className="relative overflow-hidden rounded-xl bg-gray-900 shadow-lg hover:shadow-emerald-500/20 transition-shadow duration-300 cursor-pointer"
                onClick={handleClick}
            >
                <AnimeTituloCard anime={anime} />
            </div>
            
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <AnimeInfoExt anime={anime} />
                </Modal>
            )}
        </>
    );
};
