import Link from 'next/link';
import { FiGithub, FiMail } from 'react-icons/fi';

export function Footer() {
    return (
        <footer className="bg-white border-t py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-4">AnSim-Link</h3>
                        <p className="text-gray-600 text-sm">
                            의심스러운 링크, 클릭 전에 확인하세요! 피싱 위험도를 분석해 안전하게 인터넷을 사용할 수 있도록 도와드립니다.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">바로가기</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm">
                                    홈
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                                    서비스 소개
                                </Link>
                            </li>
                            <li>
                                <Link href="/report" className="text-gray-600 hover:text-blue-600 text-sm">
                                    피싱 신고
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">연락처</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center text-gray-600 text-sm">
                                <FiMail className="mr-2" />
                                <a href="mailto:wnehdtjr5@gmail.com" className="hover:text-blue-600">
                                    wnehdtjr5@gmail.com
                                </a>
                            </li>
                            <li className="flex items-center text-gray-600 text-sm">
                                <FiGithub className="mr-2" />
                                <a href="https://github.com/MojitoBar/AnSimLink" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} AnSim-Link. All rights reserved.
                </div>
            </div>
        </footer>
    );
} 