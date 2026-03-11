'use client';

import { useState } from "react";
import { Modal } from "../common/Modal";
import { AnimeInfoExt } from './AnimeInfoExt';
import { Anime } from '@/types/anime';

export const AnimeInfoModal = ({ anime }: { anime: Anime }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div>
            <button
                className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg font-medium transition-all duration-200"
                onClick={() => setIsModalOpen(true)}
            >
                Ver Más
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AnimeInfoExt anime={anime} />
            </Modal>
        </div>
    );
};
