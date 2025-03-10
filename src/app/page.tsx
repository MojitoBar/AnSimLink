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
                의심되는 링크, 확인하고 안심하세요! 클릭 전에 URL을 검사해 피싱 사이트로부터 내 정보를 지켜드립니다.
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
                  여러 보안 데이터베이스와 검증된 알고리즘으로 의심스러운 URL을 빠르게 분석해 위험 요소를 찾아냅니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-4">
                  <FiShield className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">위험도 평가</h3>
                <p className="text-gray-600">
                  구글 세이프 브라우징, 바이러스토탈 등 다양한 보안 정보를 종합해 한눈에 알아보기 쉬운 안전 점수를 제공합니다.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-4">
                  <FiAlertTriangle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">피싱 신고</h3>
                <p className="text-gray-600">
                  새로운 피싱 사이트를 발견하셨나요? 신고해주시면 검토 후 데이터베이스에 추가해 다른 사용자들도 보호할 수 있어요.
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
                  의심되는 링크를 복사해서 입력창에 붙여넣기만 하세요.
                </p>
              </div>

              <div>
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">분석 진행</h3>
                <p className="text-gray-600">
                  버튼 한 번으로 빠르게 URL을 검사하고 위험 요소를 찾아냅니다.
                </p>
              </div>

              <div>
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">결과 확인</h3>
                <p className="text-gray-600">
                  한눈에 알아보기 쉬운 안전 점수와 상세한 분석 결과를 확인하세요.
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
