import Link from 'next/link';
import { FiShield } from 'react-icons/fi';

export function Header() {
    return (
        <header className="border-b bg-white">
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
                    {/* 모바일 메뉴 버튼 (실제 구현 시 토글 기능 추가) */}
                    <button className="text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
} 