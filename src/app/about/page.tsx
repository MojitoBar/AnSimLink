import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FiShield, FiDatabase, FiLock, FiAlertTriangle } from 'react-icons/fi';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
                {/* 소개 섹션 */}
                <section className="py-16 md:py-24 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">
                                서비스 소개
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                AnSim-Link는 사용자들이 인터넷을 더 안전하게 사용할 수 있도록 도와주는 피싱 링크 판별 서비스입니다.
                            </p>
                        </div>

                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-4">우리의 미션</h2>
                            <p className="text-lg text-gray-700 mb-6">
                                인터넷 사용자들이 피싱 사이트로 인한 개인정보 유출과 금전적 피해를 입지 않도록 돕는 것이 우리의 미션입니다. 누구나 쉽게 사용할 수 있는 서비스를 통해 피싱 사이트를 사전에 식별하고 차단함으로써 안전한 인터넷 환경을 만들어 나가고자 합니다.
                            </p>
                            <p className="text-lg text-gray-700">
                                AnSim-Link는 최신 보안 기술과 데이터베이스를 활용하여 의심스러운 URL을 분석하고, 사용자에게 해당 사이트의 안전성에 대한 정보를 제공합니다. 이를 통해 사용자는 피싱 사이트에 속아 개인정보를 입력하거나 금전적 피해를 입는 것을 방지할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 분석 기술 섹션 */}
                <section className="py-16 bg-gray-50 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <h2 className="text-3xl font-bold text-center mb-12">분석 기술</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiShield className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Google Safe Browsing</h3>
                                <p className="text-gray-600">
                                    Google에서 제공하는 API를 통해 해당 URL이 피싱, 멀웨어 등의 위험 요소를 포함하고 있는지 확인합니다.
                                    Google의 방대한 데이터베이스를 활용하여 이미 알려진 위험한 사이트를 식별합니다.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiDatabase className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">VirusTotal</h3>
                                <p className="text-gray-600">
                                    VirusTotal API를 통해 URL을 70개 이상의 안티바이러스 엔진으로 검사하여 악성 코드 및 피싱 위험을 탐지합니다.
                                    다양한 보안 업체의 데이터를 종합하여 더 정확한 판단을 제공합니다.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiLock className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">WHOIS 정보 분석</h3>
                                <p className="text-gray-600">
                                    도메인의 등록 정보를 분석하여 최근에 생성된 도메인인지, 등록자 정보가 숨겨져 있는지 등을 확인합니다.
                                    피싱 사이트는 대부분 최근에 생성된 도메인을 사용하는 경향이 있어 이를 통해 위험도를 판단합니다.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiAlertTriangle className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">URL 패턴 분석</h3>
                                <p className="text-gray-600">
                                    URL 자체의 특성을 분석하여 의심스러운 패턴(긴 서브도메인, 숫자가 많은 도메인, 유명 브랜드 이름의 변형 등)을 탐지합니다.
                                    머신러닝 알고리즘을 활용하여 지속적으로 발전하는 피싱 URL 패턴을 학습합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 팀 소개 섹션 */}
                <section className="py-16 px-4">
                    <div className="container mx-auto max-w-5xl">
                        <h2 className="text-3xl font-bold text-center mb-12">개발팀 소개</h2>

                        <div className="bg-white p-8 rounded-lg shadow-sm">
                            <p className="text-lg text-gray-700 text-center">
                                AnSim-Link는 웹 보안과 사용자 보호에 열정을 가진 개발자들이 모여 만든 서비스입니다.
                                더 안전한 인터넷 환경을 만들기 위해 지속적으로 서비스를 개선하고 있습니다.
                            </p>

                            <div className="mt-8 text-center">
                                <p className="mb-2">문의 및 제안사항:</p>
                                <a
                                    href="mailto:contact@ansimlink.com"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    contact@ansimlink.com
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
} 