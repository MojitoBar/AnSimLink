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
                            사용자가 의심스러운 URL을 입력하면 해당 사이트의 피싱 위험도를 분석하여 안전성을 평가해주는 웹 서비스입니다.
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
                                <a href="mailto:contact@ansimlink.com" className="hover:text-blue-600">
                                    contact@ansimlink.com
                                </a>
                            </li>
                            <li className="flex items-center text-gray-600 text-sm">
                                <FiGithub className="mr-2" />
                                <a href="https://github.com/yourusername/ansimlink" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
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