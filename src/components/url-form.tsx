'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FiSearch, FiAlertTriangle, FiCheckCircle, FiShield, FiX } from 'react-icons/fi';
import { FiCoffee, FiGift, FiHeart } from 'react-icons/fi';
import confetti from 'canvas-confetti';

const urlSchema = z.object({
    url: z.string().url('유효한 URL을 입력해주세요')
});

// 이스터에그 URL 목록
const easterEggUrls = {
    'https://www.google.com': {
        message: '구글은 안전하지만, 검색 기록은 당신을 지켜보고 있어요! 👀',
        icon: <FiSearch className="h-8 w-8 text-blue-500" />,
        color: 'bg-blue-100'
    },
    'https://www.naver.com': {
        message: '네이버는 안전하지만, 당신의 검색어가 실시간 검색어에 오르지 않길 바랄게요! 😉',
        icon: <FiCoffee className="h-8 w-8 text-green-500" />,
        color: 'bg-green-100'
    },
    'https://www.youtube.com': {
        message: '유튜브는 안전하지만, 한 영상만 보려다가 3시간이 사라질 수 있어요! ⏰',
        icon: <FiHeart className="h-8 w-8 text-red-500" />,
        color: 'bg-red-100'
    },
    'https://www.github.com': {
        message: '개발자시군요! 당신의 코드는 안전하지만, 커밋 메시지는 더 자세히 쓰세요! 💻',
        icon: <FiGift className="h-8 w-8 text-purple-500" />,
        color: 'bg-purple-100'
    },
    'https://ansim-link.vercel.app': {
        message: 'AnSim-Link는 안전하니 안심하세요! 🔒',
        icon: <FiShield className="h-8 w-8 text-blue-500" />,
        color: 'bg-blue-100'
    }
};

type FormValues = z.infer<typeof urlSchema>;

export function UrlForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [easterEgg, setEasterEgg] = useState<any>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(urlSchema),
        defaultValues: {
            url: ''
        }
    });

    // 이스터에그 효과 실행 함수
    const triggerEasterEgg = (url: string) => {
        // URL이 이스터에그 목록에 있는지 확인
        const normalizedUrl = url.replace(/\/$/, ''); // 끝에 슬래시 제거

        for (const [eggUrl, eggData] of Object.entries(easterEggUrls)) {
            if (normalizedUrl.toLowerCase() === eggUrl.toLowerCase()) {
                setEasterEgg(eggData);

                // 컨페티 효과 실행
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                return true;
            }
        }

        setEasterEgg(null);
        return false;
    };

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        setError(null);
        setEasterEgg(null);

        // 이스터에그 확인
        const isEasterEgg = triggerEasterEgg(data.url);

        // 이스터에그가 아니면 일반 분석 진행
        if (!isEasterEgg) {
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: data.url }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || '분석 중 오류가 발생했습니다.');
                }

                const result = await response.json();
                setResult(result);
            } catch (err: any) {
                setError(err.message || 'URL 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
                console.error(err);
            }
        } else {
            // 이스터에그인 경우 결과 초기화
            setResult(null);
        }

        setIsLoading(false);
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="분석할 URL을 입력하세요 (예: https://example.com)"
                                            {...field}
                                            className="flex-1"
                                            disabled={isLoading}
                                        />
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? '분석 중...' : <><FiSearch className="mr-2" /> 분석하기</>}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>

            {error && (
                <Alert variant="destructive" className="mt-6">
                    <FiAlertTriangle className="h-4 w-4" />
                    <AlertTitle>오류</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {easterEgg && (
                <Card className="mt-6 overflow-hidden">
                    <div className={`p-6 ${easterEgg.color} flex items-center gap-4`}>
                        {easterEgg.icon}
                        <div className="text-lg font-medium">{easterEgg.message}</div>
                    </div>
                </Card>
            )}

            {result && (
                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">분석 결과</h3>
                                {result.isSafe ? (
                                    <div className="flex items-center text-green-500">
                                        <FiCheckCircle className="mr-2" /> 안전
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600 font-bold bg-red-50 px-3 py-1 rounded-md border border-red-200">
                                        <FiAlertTriangle className="mr-2 text-xl" /> 위험
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">분석 URL</p>
                                <p className="font-medium break-all">{result.url}</p>
                            </div>

                            <div className={`mt-4 p-4 rounded-lg border ${result.isSafe ? 'bg-blue-50 border-blue-100' : 'bg-red-50 border-red-200'}`}>
                                <h4 className={`font-medium mb-2 ${result.isSafe ? 'text-blue-800' : 'text-red-800'}`}>설명</h4>
                                {result.isSafe ? (
                                    <p className="text-blue-700">
                                        이 웹사이트는 안전한 것으로 보입니다. 안심하고 이용하셔도 됩니다.
                                    </p>
                                ) : (
                                    <div className="text-red-600">
                                        <p className="font-medium">이 웹사이트는 의심스러운 점이 있습니다. 조심하세요!</p>
                                        <ul className="list-disc list-inside mt-2 space-y-1">
                                            {result.details.googleCustomSearch.isHighlySuspicious && (
                                                <li className="text-red-700 font-medium">인터넷 검색 결과가 거의 없는 새로운 사이트입니다.</li>
                                            )}
                                            {result.details.googleCustomSearch.isSuspicious && !result.details.googleCustomSearch.isHighlySuspicious && (
                                                <li className="text-red-700 font-medium">인터넷 검색 결과가 적은 잘 알려지지 않은 사이트입니다.</li>
                                            )}
                                            {result.details.googleSafeBrowsing.threatType && (
                                                <li className="text-red-700 font-medium">구글에서 위험한 사이트로 분류했습니다.</li>
                                            )}
                                            {result.details.virusTotal.maliciousCount > 0 && (
                                                <li className="text-red-700 font-medium">보안 프로그램에서 위험하다고 판단했습니다.</li>
                                            )}
                                            {result.details.whois.score < 50 && (
                                                <li className="text-red-700 font-medium">최근에 만들어진 새로운 웹사이트입니다.</li>
                                            )}
                                            {result.details.urlAnalysis.suspicious && (
                                                <li className="text-red-700 font-medium">주소에 의심스러운 글자나 기호가 포함되어 있습니다.</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {result.details.googleCustomSearch && (
                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center mb-2">
                                            <FiSearch className="mr-2" />
                                            <h4 className="font-medium">Google 검색 분석</h4>
                                        </div>
                                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                                            <div className="flex items-center">
                                                {result.details.googleCustomSearch.isHighlySuspicious ? (
                                                    <>
                                                        <FiX className="h-5 w-5 text-red-600 mr-2" />
                                                        <span className="text-red-600 font-medium">
                                                            검색 결과에서 매우 의심스러움
                                                        </span>
                                                    </>
                                                ) : result.details.googleCustomSearch.isSuspicious ? (
                                                    <>
                                                        <FiAlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                                                        <span className="text-yellow-500 font-medium">
                                                            검색 결과에서 의심스러움
                                                        </span>
                                                    </>
                                                ) : result.details.googleCustomSearch.isInTopResults ? (
                                                    <>
                                                        <FiCheckCircle className="h-5 w-5 text-green-600 mr-2" />
                                                        <span className="text-green-600 font-medium">
                                                            검색 결과에서 발견됨
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiX className="h-5 w-5 text-red-600 mr-2" />
                                                        <span className="text-red-600 font-medium">
                                                            검색 결과에서 발견되지 않음
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <p>
                                                    <span className="font-medium">점수:</span>{" "}
                                                    {result.details.googleCustomSearch.score}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="border rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <FiShield className="mr-2" />
                                        <h4 className="font-medium">WHOIS 정보</h4>
                                    </div>
                                    <p className="text-sm">등록일: {result.details.whois.registrationDate}</p>
                                    <p className="text-sm">만료일: {result.details.whois.expirationDate}</p>
                                    <div className="mt-1 text-sm">
                                        {result.details.whois.isNewDomain && (
                                            <p className="text-yellow-500 font-medium">최근 90일 이내에 등록된 도메인입니다.</p>
                                        )}
                                        {result.details.whois.isNewDomain && (
                                            <p className="mt-1 text-sm text-yellow-500">
                                                최근에 등록된 도메인은 피싱이나 사기에 자주 사용됩니다.
                                                특히 유명 서비스나 브랜드와 관련된 경우 주의가 필요합니다.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="border rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <FiShield className="mr-2" />
                                        <h4 className="font-medium">Google Safe Browsing</h4>
                                    </div>
                                    <p className={result.details.googleSafeBrowsing.safe ? 'text-green-500' : 'text-red-500 font-medium'}>
                                        {result.details.googleSafeBrowsing.safe ? '안전함' : '위험 감지됨'}
                                    </p>
                                    {!result.details.googleSafeBrowsing.safe && (
                                        <p className="mt-1 text-sm text-red-500">
                                            Google Safe Browsing에서 이 사이트를 위험하다고 판단했습니다.
                                            악성코드, 피싱, 또는 유해한 콘텐츠가 포함되어 있을 수 있습니다.
                                        </p>
                                    )}
                                </div>

                                <div className="border rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <FiShield className="mr-2" />
                                        <h4 className="font-medium">VirusTotal</h4>
                                    </div>
                                    <p className={result.details.virusTotal.safe ? 'text-green-500' : 'text-red-500 font-medium'}>
                                        {result.details.virusTotal.safe ? '안전함' : '위험 감지됨'}
                                    </p>
                                    {!result.details.virusTotal.safe && (
                                        <p className="mt-1 text-sm text-red-500">
                                            VirusTotal의 여러 보안 엔진에서 이 URL을 위험하다고 판단했습니다.
                                            악성코드 배포, 피싱, 또는 사기 사이트일 가능성이 높습니다.
                                        </p>
                                    )}
                                </div>

                                {result.details.suspiciousDomains && (
                                    <div className="border rounded-lg p-3">
                                        <div className="flex items-center mb-2">
                                            <FiShield className="mr-2" />
                                            <h4 className="font-medium">의심 도메인 분석</h4>
                                        </div>
                                        <p className={result.details.suspiciousDomains.isTyposquatting ? 'text-red-500 font-medium' : 'text-green-500'}>
                                            {result.details.suspiciousDomains.isTyposquatting ? '의심 도메인 감지됨' : '정상 도메인'}
                                        </p>
                                        {result.details.suspiciousDomains.isTyposquatting && (
                                            <p className="mt-1 text-sm text-red-500">
                                                이 도메인은 유명 사이트와 유사하게 만들어진 의심스러운 도메인입니다.
                                                타이포스쿼팅(오타를 이용한 유사 도메인)이나 유사 문자를 사용한
                                                사기 사이트일 가능성이 있습니다.
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="border rounded-lg p-3">
                                    <div className="flex items-center mb-2">
                                        <FiShield className="mr-2" />
                                        <h4 className="font-medium">URL 분석</h4>
                                    </div>
                                    <p className={result.details.urlAnalysis.suspicious ? 'text-red-500 font-medium' : 'text-green-500'}>
                                        {result.details.urlAnalysis.suspicious ? '의심스러운 패턴 발견' : '정상 패턴'}
                                    </p>
                                    {result.details.urlAnalysis.suspicious && (
                                        <p className="mt-1 text-sm text-red-500">
                                            이 URL은 일반적이지 않은 패턴을 포함하고 있어 의심스럽습니다.
                                            무작위 문자열, 과도한 숫자나 특수문자 사용은 자동 생성된
                                            악성 도메인의 특징일 수 있습니다.
                                        </p>
                                    )}
                                    {result.details.urlAnalysis.patterns && (
                                        <div className="mt-2 text-sm">
                                            <p className="font-medium mb-1">발견된 의심 패턴:</p>
                                            <ul className="list-disc list-inside text-gray-600">
                                                {result.details.urlAnalysis.patterns.longSubdomain && (
                                                    <li>비정상적으로 긴 서브도메인</li>
                                                )}
                                                {result.details.urlAnalysis.patterns.tooManySubdomains && (
                                                    <li>과도하게 많은 서브도메인</li>
                                                )}
                                                {result.details.urlAnalysis.patterns.tooManyNumbers && (
                                                    <li>도메인에 숫자가 많음</li>
                                                )}
                                                {result.details.urlAnalysis.patterns.suspiciousKeywords && (
                                                    <li>의심스러운 키워드 포함</li>
                                                )}
                                                {result.details.urlAnalysis.patterns.randomDomain && (
                                                    <li>무작위 문자열 패턴</li>
                                                )}
                                                {result.details.urlAnalysis.patterns.dashesInDomain && (
                                                    <li>과도한 대시(-) 사용</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <p className="text-sm text-gray-500">
                                    {result.isSafe
                                        ? '이 URL은 현재 분석 결과 안전한 것으로 판단됩니다. 그러나 항상 주의하세요.'
                                        : '이 URL은 위험한 것으로 판단됩니다. 접속하지 않는 것을 권장합니다.'}
                                </p>
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">URL 안전 사용 팁</h3>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>이메일이나 메시지로 받은 링크는 항상 의심하세요.</li>
                                    <li>URL이 정확한지 확인하고, 오타나 비슷한 도메인 이름에 주의하세요.</li>
                                    <li>https:// 프로토콜을 사용하는 사이트인지 확인하세요.</li>
                                    <li>중요한 정보를 입력하기 전에 항상 사이트의 신뢰성을 확인하세요.</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 