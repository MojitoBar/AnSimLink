import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { UrlForm } from '@/components/url-form';
import { FiShield, FiSearch, FiAlertTriangle } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* 히어로 섹션 */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-blue-600">안전한</span> 인터넷 사용을 위한 <br />
                피싱 링크 판별 서비스
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                의심스러운 URL을 입력하면 해당 사이트의 피싱 위험도를 분석하여 안전성을 평가해드립니다.
              </p>
            </div>

            <UrlForm />
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-4">
                  <FiSearch className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">URL 분석 시스템</h3>
                <p className="text-gray-600">
                  입력된 URL을 다양한 보안 데이터베이스와 알고리즘을 통해 분석하여 위험 요소를 탐지합니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-4">
                  <FiShield className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">위험도 평가</h3>
                <p className="text-gray-600">
                  Google Safe Browsing, VirusTotal, WHOIS 정보 등을 종합하여 URL의 안전성을 점수로 제공합니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-4">
                  <FiAlertTriangle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">피싱 신고</h3>
                <p className="text-gray-600">
                  새로운 피싱 사이트를 발견하셨다면 신고해주세요. 여러분의 신고가 다른 사용자를 보호합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 사용 방법 섹션 */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">사용 방법</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">URL 입력</h3>
                <p className="text-gray-600">
                  의심스러운 URL을 입력 폼에 붙여넣거나 입력하세요.
                </p>
              </div>

              <div>
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">분석 진행</h3>
                <p className="text-gray-600">
                  시스템이 자동으로 URL을 분석하여 위험 요소를 검사합니다.
                </p>
              </div>

              <div>
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">결과 확인</h3>
                <p className="text-gray-600">
                  안전성 점수와 함께 상세한 분석 결과를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
