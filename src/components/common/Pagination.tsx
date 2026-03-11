'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    lastPage: number | undefined;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    hasNextPage: boolean | undefined;
    setHasNextPage: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

export const PaginationComp: React.FC<PaginationProps> = ({
    lastPage,
    currentPage,
    setCurrentPage,
    hasNextPage,
    setHasNextPage,
}) => {
    return (
        <div className="flex items-center gap-2">
            <button
                className={`p-2 rounded-lg transition-all duration-200 ${
                    currentPage === 1 
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                        : 'bg-gray-800 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400'
                }`}
                onClick={() => {
                    if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        setHasNextPage(true);
                    }
                }}
                disabled={currentPage === 1}
            >
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <span className="px-4 py-2 bg-gray-800 rounded-lg text-gray-300 font-medium">
                <span className="text-emerald-400">{currentPage}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-400">{lastPage}</span>
            </span>
            
            <button
                className={`p-2 rounded-lg transition-all duration-200 ${
                    !hasNextPage 
                        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                        : 'bg-gray-800 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400'
                }`}
                onClick={() => {
                    if (hasNextPage) {
                        setCurrentPage(currentPage + 1);
                    }
                }}
                disabled={!hasNextPage}
            >
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
};
