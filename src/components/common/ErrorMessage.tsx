'use client';

import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
    error?: string;
    message?: string;
}

export const ErrorMessage = ({ error, message }: ErrorMessageProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="bg-red-500/10 p-4 rounded-full mb-4">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
                {message ? message : 'Disculpa, se produjo un error'}
            </h2>
            <p className="text-gray-400 text-center mb-4">
                Por favor, intenta nuevamente
            </p>
            <Link 
                href="/" 
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
                Volver al inicio
            </Link>
        </div>
    );
};
