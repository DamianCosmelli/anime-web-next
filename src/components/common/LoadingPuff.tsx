'use client';

import { useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";

export const LoadingPuff = () => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            {visible && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <PuffLoader
                        color="#10b981"
                        loading
                        size={60}
                    />
                    <p className="text-gray-400 mt-4 text-lg">Cargando...</p>
                </div>
            )}
        </div>
    );
};
