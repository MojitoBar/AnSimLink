"use client";

import Link from 'next/link';
import { FiShield } from 'react-icons/fi';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="border-b bg-white relative">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <FiShield className="h-6 w-6 text-blue-600" />
                    <span className="font-bold text-xl">AnSim-Link</span>
                </Link>

                <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="text-gray-700 hover:text-blue-600">
                        홈
                    </Link>
                    <Link href="/about" className="text-gray-700 hover:text-blue-600">
                        서비스 소개
                    </Link>
                    <Link href="/report" className="text-gray-700 hover:text-blue-600">
                        피싱 신고
                    </Link>
                </nav>

                <div className="md:hidden">
                    {/* 모바일 메뉴 버튼 */}
                    <button
                        className="text-gray-700 z-20 relative"
                        onClick={toggleMenu}
                        aria-label="메뉴 열기"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 모바일 메뉴 */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-10">
                    <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
                        <Link href="/" className="text-gray-700 hover:text-blue-600 py-2">
                            홈
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-blue-600 py-2">
                            서비스 소개
                        </Link>
                        <Link href="/report" className="text-gray-700 hover:text-blue-600 py-2">
                            피싱 신고
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
} 