'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { TrophyIcon, CalendarDaysIcon, MagnifyingGlassIcon, TvIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const BASE_PATH = '/anime-web-next';

const navItems = [
    { icon: <TvIcon className="w-5 h-5" />, title: "En Emisión", route: `/` },
    { icon: <CalendarDaysIcon className="w-5 h-5" />, title: "Temporadas", route: `/temporada/` },
    { icon: <MagnifyingGlassIcon className="w-5 h-5" />, title: "Buscar", route: `/search/` },
    { icon: <TrophyIcon className="w-5 h-5" />, title: "Top", route: `/top/` },
];

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Navbar moderno */}
            <nav className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href={`/`} className="flex items-center gap-3 group">
                            <Image src={`${BASE_PATH}/logo.png`} alt="Logo" width={40} height={40} className="rounded-lg" />
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                AnimeWeb
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.route;
                                return (
                                    <Link
                                        key={item.route}
                                        href={item.route}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                            isActive
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-gray-900 border-t border-gray-800">
                        <div className="px-4 py-3 space-y-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.route;
                                return (
                                    <Link
                                        key={item.route}
                                        href={item.route}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                            isActive
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900/50 border-t border-gray-800 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        © 2025 <span className="text-emerald-400 font-semibold">AnimeWeb</span> — Datos proporcionados por Jikan API
                    </p>
                </div>
            </footer>
        </div>
    );
}
