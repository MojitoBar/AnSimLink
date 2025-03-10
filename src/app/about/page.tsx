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
                                인터넷을 사용하다 보면 누구나 피싱 사이트에 속을 수 있어요. 우리는 이런 위험으로부터 여러분의 소중한 개인정보와 자산을 지키고 싶습니다. 누구나 쉽게 사용할 수 있는 서비스로 피싱 사이트를 미리 차단해 더 안전한 인터넷 환경을 만들어 가는 것이 목표예요.
                            </p>
                            <p className="text-lg text-gray-700">
                                최신 보안 기술과 데이터베이스를 활용해 의심스러운 URL을 분석하고, 그 결과를 쉽게 이해할 수 있게 알려드립니다. 이를 통해 피싱 사이트에 속아 개인정보를 입력하거나 금전적 피해를 입는 것을 막을 수 있어요.
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
                                    구글에서 제공하는 API로 해당 URL이 피싱이나 멀웨어 위험이 있는지 확인해요.
                                    구글의 방대한 데이터베이스를 활용해 이미 알려진 위험한 사이트를 빠르게 찾아냅니다.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiDatabase className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">VirusTotal</h3>
                                <p className="text-gray-600">
                                    70개 이상의 안티바이러스 엔진으로 URL을 검사해 악성코드와 피싱 위험을 찾아냅니다.
                                    여러 보안 업체의 데이터를 한번에 확인해 더 정확한 결과를 제공해요.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiLock className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">WHOIS 정보 분석</h3>
                                <p className="text-gray-600">
                                    도메인이 언제 만들어졌는지, 누가 등록했는지 등의 정보를 확인합니다.
                                    피싱 사이트는 대부분 최근에 만들어진 도메인을 사용하기 때문에 이 정보로 위험을 예측할 수 있어요.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="text-blue-600 mb-4">
                                    <FiAlertTriangle className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">URL 패턴 분석</h3>
                                <p className="text-gray-600">
                                    URL 자체의 특징을 분석해 의심스러운 패턴(긴 주소, 이상한 숫자 조합, 유명 브랜드 이름의 살짝 다른 버전 등)을 찾아냅니다.
                                    머신러닝 기술로 계속 발전하는 피싱 URL 패턴도 학습해 대응합니다.
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
                                AnSim-Link는 웹 보안과 사용자 보호에 관심 많은 개발자들이 함께 만든 서비스입니다.
                                더 안전한 인터넷 환경을 위해 계속 서비스를 개선하고 있어요.
                            </p>

                            <div className="mt-8 text-center">
                                <p className="mb-2">문의 및 제안사항:</p>
                                <a
                                    href="mailto:wnehdtjr5@gmail.com"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                    wnehdtjr5@gmail.com
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