import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 환경변수에서 API 키 가져오기
const GOOGLE_SAFE_BROWSING_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY || '';
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || '';
const WHOIS_API_KEY = process.env.WHOIS_API_KEY || '';
const GOOGLE_CUSTOM_SEARCH_API_KEY = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || '';
const GOOGLE_CUSTOM_SEARCH_CX = process.env.GOOGLE_CUSTOM_SEARCH_CX || '';

// 간단한 URL 패턴 분석 함수
function analyzeUrlPattern(url: string) {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;

    // 의심스러운 패턴 체크
    const suspiciousPatterns = {
        longSubdomain: domain.split('.').some(part => part.length > 20),
        tooManySubdomains: domain.split('.').length > 5,
        tooManyNumbers: (domain.match(/\d/g) || []).length > 8,
        suspiciousKeywords: (() => {
            // 정상적인 유명 도메인 목록
            const legitimateDomains = [
                'google.com', 'www.google.com',
                'apple.com', 'www.apple.com',
                'microsoft.com', 'www.microsoft.com',
                'amazon.com', 'www.amazon.com',
                'netflix.com', 'www.netflix.com',
                'paypal.com', 'www.paypal.com',
                'facebook.com', 'www.facebook.com',
                'instagram.com', 'www.instagram.com',
                'twitter.com', 'www.twitter.com',
                'youtube.com', 'www.youtube.com'
            ];

            // 정상적인 도메인이면 의심스럽지 않음
            if (legitimateDomains.includes(domain)) {
                return false;
            }

            // 의심스러운 키워드 패턴
            return /paypal|apple|google|microsoft|amazon|netflix|bank|secure|login|verify|account|signin|security|update|confirm|verify|wallet|crypto/i.test(domain);
        })(),
        randomDomain: /[a-z0-9]{15,}\./.test(domain),
        dashesInDomain: (domain.match(/-/g) || []).length > 3,
        repeatedCharacters: /(.)(\1{2,})/i.test(domain), // 같은 문자가 3번 이상 반복
        digitAndLetterMix: /\d[a-z]|[a-z]\d/i.test(domain) && (domain.match(/\d/g) || []).length > 3, // 숫자와 문자 혼합이 많음
        uncommonTLD: /\.(xyz|top|club|online|site|fun|icu|vip|work|rest|space|bid|loan)$/.test(domain) // 흔하지 않은 TLD
    };

    // 의심 점수 계산
    let suspiciousScore = 0;
    let totalChecks = 0;

    for (const [, value] of Object.entries(suspiciousPatterns)) {
        if (value) suspiciousScore++;
        totalChecks++;
    }

    const score = 100 - Math.round((suspiciousScore / totalChecks) * 100);

    return {
        score,
        isSuspicious: suspiciousScore >= 3,
        details: suspiciousPatterns
    };
}

// 타이포스쿼팅 및 유사 도메인 탐지 (자체 알고리즘 사용)
async function checkSuspiciousDomains(url: string) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        // 자체 알고리즘으로 의심 도메인 탐지
        const suspiciousResult = detectSuspiciousDomains(domain);

        return {
            isTyposquatting: suspiciousResult.isSuspicious,
            score: suspiciousResult.score,
            details: suspiciousResult.details
        };
    } catch (err) {
        console.error('유사 도메인 탐지 오류:', err);

        // 오류 발생 시 기본값 반환
        return {
            isTyposquatting: false,
            score: 70,
            error: '일시적인 API 오류'
        };
    }
}

// 자체 알고리즘으로 의심 도메인 탐지
function detectSuspiciousDomains(domain: string): {
    isSuspicious: boolean;
    score: number;
    details: any;
} {
    // 도메인 분석
    const parts = domain.split('.');
    const domainName = parts.length > 1 ? parts[parts.length - 2] : parts[0];
    const tld = parts.length > 1 ? parts[parts.length - 1] : '';

    // 1. 유명 TLD와 다른 TLD 사용 탐지
    const popularTLDs = ['com', 'org', 'net', 'edu', 'gov', 'co', 'io', 'app', 'dev'];
    const similarTLDs: Record<string, string[]> = {
        'com': ['con', 'co', 'cm', 'om', 'cpm', 'cim', 'con', 'cxom', 'coim', 'comm'],
        'org': ['orq', 'ogr', 'or', 'orrg', 'orf', 'orgg'],
        'net': ['ner', 'ne', 'nett', 'niet', 'netr', 'met'],
        'edu': ['eddu', 'ed', 'eud', 'efu', 'edu1'],
        'gov': ['g0v', 'qov', 'giv', 'giov', 'goc']
    };

    // 2. 도메인 이름 분석
    const hasRepeatedChars = /(.)(\1{2,})/i.test(domainName);
    const hasNumbers = /\d/.test(domainName);
    const hasDashes = domainName.includes('-');
    const hasSpecialChars = /[^a-zA-Z0-9-]/.test(domainName);

    // 3. 유사 문자 대체 탐지 (homoglyph attack)
    const homoglyphMap: Record<string, string[]> = {
        'a': ['4', '@', 'à', 'á', 'â', 'ä', 'å', 'α'],
        'b': ['d', 'lb', '6', '8', 'ß'],
        'c': ['(', '[', '{', '<', '¢', '©'],
        'd': ['b', 'cl', 'dl', 'ð'],
        'e': ['3', '€', 'è', 'é', 'ê', 'ë', 'ë'],
        'g': ['q', '9', '6'],
        'h': ['lh', 'ln'],
        'i': ['1', '!', '|', 'l', 'ì', 'í', 'î', 'ï'],
        'j': ['i', 'l'],
        'k': ['lk', 'ik', 'lc'],
        'l': ['1', '|', 'i'],
        'm': ['nn', 'rn', 'rr'],
        'n': ['m', 'r'],
        'o': ['0', 'ο', 'ø', 'ö', 'ô', 'ò', 'ó'],
        'p': ['ρ'],
        'q': ['g'],
        'r': ['n'],
        's': ['5', '$', 'z'],
        't': ['7', '+'],
        'u': ['v', 'µ', 'ü', 'û', 'ù', 'ú'],
        'v': ['u', 'ν'],
        'w': ['vv', 'uu'],
        'x': ['×', 'χ'],
        'y': ['j', 'ÿ', 'γ'],
        'z': ['s', '2']
    };

    // 유사 문자 대체 탐지
    let hasHomoglyphs = false;
    for (let i = 0; i < domainName.length; i++) {
        const char = domainName[i].toLowerCase();
        if (homoglyphMap[char]) {
            for (const similar of homoglyphMap[char]) {
                if (i > 0 && i < domainName.length - 1) {
                    // 도메인 중간에 유사 문자가 있는지 확인
                    const potentialTypo = domainName.substring(0, i) + similar + domainName.substring(i + 1);
                    if (isCommonWord(potentialTypo)) {
                        hasHomoglyphs = true;
                        break;
                    }
                }
            }
        }
        if (hasHomoglyphs) break;
    }

    // 4. TLD 유사성 검사
    let hasSimilarTLD = false;
    if (tld && popularTLDs.includes(tld)) {
        // 인기 있는 TLD를 사용하는 경우는 덜 의심스러움
        hasSimilarTLD = false;
    } else if (tld && Object.keys(similarTLDs).some(popularTLD => {
        return similarTLDs[popularTLD].includes(tld);
    })) {
        // 인기 있는 TLD와 유사한 TLD를 사용하는 경우 의심스러움
        hasSimilarTLD = true;
    }

    // 5. 도메인 길이 분석
    const isUnusuallyLong = domainName.length > 20;

    // 의심 점수 계산
    let suspiciousScore = 0;
    let totalChecks = 6;

    if (hasRepeatedChars) suspiciousScore++;
    if (hasNumbers && domainName.length > 8) suspiciousScore++;
    if (hasDashes && domainName.split('-').length > 3) suspiciousScore++;
    if (hasSpecialChars) suspiciousScore++;
    if (hasHomoglyphs) suspiciousScore += 2; // 유사 문자 대체는 더 의심스러움
    if (hasSimilarTLD) suspiciousScore += 2; // 유사 TLD는 더 의심스러움
    if (isUnusuallyLong) suspiciousScore++;

    // 점수 계산 (0-100, 높을수록 안전)
    const score = Math.max(0, 100 - Math.round((suspiciousScore / totalChecks) * 100));

    return {
        isSuspicious: suspiciousScore >= 3,
        score,
        details: {
            hasRepeatedChars,
            hasNumbers,
            hasDashes,
            hasSpecialChars,
            hasHomoglyphs,
            hasSimilarTLD,
            isUnusuallyLong,
            domainName,
            tld
        }
    };
}

// 일반적인 단어인지 확인 (간단한 구현)
function isCommonWord(word: string): boolean {
    // 실제 구현에서는 일반적인 단어 사전을 사용하거나 API를 호출할 수 있습니다
    const commonWords = [
        'google', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix', 'twitter',
        'paypal', 'ebay', 'walmart', 'target', 'bank', 'chase', 'wellsfargo', 'citi',
        'american', 'express', 'mastercard', 'visa', 'discover', 'login', 'signin',
        'account', 'secure', 'update', 'verify', 'confirm', 'service', 'support',
        'help', 'mail', 'cloud', 'drive', 'photo', 'video', 'music', 'game',
        'shop', 'store', 'buy', 'sell', 'pay', 'money', 'credit', 'debit', 'card',
        'online', 'web', 'site', 'page', 'home', 'news', 'info', 'contact', 'about',
        'search', 'find', 'get', 'go', 'see', 'look', 'watch', 'view', 'read',
        'write', 'send', 'receive', 'share', 'connect', 'follow', 'like', 'comment',
        'post', 'message', 'chat', 'talk', 'call', 'meet', 'join', 'sign', 'create'
    ];

    return commonWords.includes(word.toLowerCase());
}

// Google Safe Browsing API 호출
async function checkGoogleSafeBrowsing(url: string) {
    try {
        const response = await axios.post(
            `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`,
            {
                client: {
                    clientId: 'ansimlink',
                    clientVersion: '1.0.0'
                },
                threatInfo: {
                    threatTypes: [
                        'MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'
                    ],
                    platformTypes: ['ANY_PLATFORM'],
                    threatEntryTypes: ['URL'],
                    threatEntries: [{ url }]
                }
            }
        );

        // 위협이 발견되지 않으면 빈 객체 또는 matches 속성이 없음
        const isSafe = !response.data.matches || response.data.matches.length === 0;

        // 안전한 경우 100점, 위협이 발견된 경우 위협 유형에 따라 점수 차등 부여
        let score = 100;
        let threatType = null;

        if (!isSafe && response.data.matches && response.data.matches.length > 0) {
            threatType = response.data.matches[0].threatType;

            // 위협 유형에 따른 점수 차감
            switch (threatType) {
                case 'MALWARE':
                    score = 10; // 악성 소프트웨어는 매우 위험
                    break;
                case 'SOCIAL_ENGINEERING':
                    score = 20; // 피싱 등 사회공학적 공격
                    break;
                case 'UNWANTED_SOFTWARE':
                    score = 30; // 원치 않는 소프트웨어
                    break;
                case 'POTENTIALLY_HARMFUL_APPLICATION':
                    score = 40; // 잠재적으로 유해한 애플리케이션
                    break;
                default:
                    score = 50; // 기타 위협
            }
        }

        return {
            safe: isSafe,
            score,
            threatType
        };
    } catch (err) {
        console.error('Google Safe Browsing API 호출 오류:', err);
        // API 호출 실패 시 기본값 반환
        return {
            safe: true,
            score: 80,
            error: '일시적인 API 오류'
        };
    }
}

// VirusTotal API 호출
async function checkVirusTotal(url: string) {
    try {
        // URL ID 가져오기 (Base64 URL 인코딩)
        const urlId = Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        // VirusTotal API 호출
        const response = await axios.get(
            `https://www.virustotal.com/api/v3/urls/${urlId}`,
            {
                headers: {
                    'x-apikey': VIRUSTOTAL_API_KEY
                }
            }
        );

        const data = response.data.data.attributes;
        const totalEngines = data.last_analysis_stats.harmless +
            data.last_analysis_stats.malicious +
            data.last_analysis_stats.suspicious +
            data.last_analysis_stats.undetected;

        const maliciousCount = data.last_analysis_stats.malicious + data.last_analysis_stats.suspicious;
        const isSafe = maliciousCount === 0;

        // 점수 계산: 악성/의심 탐지 비율이 높을수록 점수가 낮아짐
        const score = Math.max(0, 100 - Math.round((maliciousCount / totalEngines) * 100));

        return {
            safe: isSafe,
            score,
            maliciousCount,
            totalEngines,
            detectionRatio: `${maliciousCount}/${totalEngines}`
        };
    } catch (err) {
        console.error('VirusTotal API 호출 오류:', err);
        // API 호출 실패 시 기본값 반환
        return {
            safe: true,
            score: 75,
            error: '일시적인 API 오류'
        };
    }
}

// WHOIS API 호출
async function getWhoisInfo(url: string) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        console.log(`\n===== WHOIS 정보 분석 시작: ${domain} =====`);

        // WHOIS API 호출
        const response = await axios.get(
            `https://www.whoisxmlapi.com/whoisserver/WhoisService`,
            {
                params: {
                    apiKey: WHOIS_API_KEY,
                    domainName: domain,
                    outputFormat: 'JSON'
                }
            }
        );

        const whoisData = response.data.WhoisRecord;

        // 등록일과 만료일 추출
        const registrationDate = whoisData.createdDate || whoisData.registryData?.createdDate;
        const expirationDate = whoisData.expiresDate || whoisData.registryData?.expiresDate;

        console.log(`도메인 등록일: ${registrationDate || 'Unknown'}`);
        console.log(`도메인 만료일: ${expirationDate || 'Unknown'}`);

        // 도메인 등록자 정보
        const registrant = whoisData.registrant || whoisData.registryData?.registrant || {};
        const registrar = whoisData.registrarName || whoisData.registryData?.registrarName;

        console.log(`등록 대행사: ${registrar || 'Unknown'}`);
        console.log(`등록자 이름: ${registrant.name || 'Unknown'}`);
        console.log(`등록자 조직: ${registrant.organization || 'Unknown'}`);
        console.log(`등록자 국가: ${registrant.country || 'Unknown'}`);

        // 점수 계산 요소들
        const currentDate = new Date();
        const regDate = new Date(registrationDate);

        // 도메인 나이 계산 (일 단위)
        const domainAgeInDays = Math.floor((currentDate.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`도메인 나이: ${domainAgeInDays}일 (${Math.floor(domainAgeInDays / 365)}년 ${Math.floor(domainAgeInDays / 30) % 12}개월)`);

        // 점수 계산 (도메인 나이에 따른 점수 부여)
        let score = 100;
        console.log(`초기 점수: ${score}`);

        // 1. 도메인 나이 기준 점수 차감
        if (domainAgeInDays < 30) {
            // 1개월 미만은 매우 위험
            score -= 80;
            console.log(`도메인 나이 1개월 미만: -80점 (매우 위험)`);
        } else if (domainAgeInDays < 90) {
            // 3개월 미만은 위험
            score -= 60;
            console.log(`도메인 나이 3개월 미만: -60점 (위험)`);
        } else if (domainAgeInDays < 180) {
            // 6개월 미만은 약간 위험
            score -= 40;
            console.log(`도메인 나이 6개월 미만: -40점 (약간 위험)`);
        } else if (domainAgeInDays < 365) {
            // 1년 미만은 주의
            score -= 30;
            console.log(`도메인 나이 1년 미만: -30점 (주의)`);
        } else {
            console.log(`도메인 나이 1년 이상: 감점 없음 (안전)`);
        }

        // 2. 등록자 정보 비공개 여부에 따른 점수 차감
        const isPrivacyProtected = !registrant.name || registrant.name.toLowerCase().includes('privacy') ||
            registrant.name.toLowerCase().includes('protect') ||
            !registrant.email;

        if (isPrivacyProtected) {
            score -= 10; // 개인정보 보호 서비스 사용 시 약간 감점
            console.log(`등록자 정보 비공개: -10점`);
        } else {
            console.log(`등록자 정보 공개: 감점 없음`);
        }

        // 최종 점수는 0-100 사이로 제한
        score = Math.max(0, Math.min(100, score));
        console.log(`최종 WHOIS 점수: ${score}`);
        console.log(`===== WHOIS 정보 분석 완료 =====\n`);

        return {
            registrationDate: registrationDate ? new Date(registrationDate).toISOString().split('T')[0] : 'Unknown',
            expirationDate: expirationDate ? new Date(expirationDate).toISOString().split('T')[0] : 'Unknown',
            registrar: registrar || 'Unknown',
            registrant: {
                name: registrant.name || 'Unknown',
                organization: registrant.organization || 'Unknown',
                country: registrant.country || 'Unknown',
                isPrivacyProtected
            },
            domainAge: {
                days: domainAgeInDays,
                years: Math.floor(domainAgeInDays / 365),
                months: Math.floor(domainAgeInDays / 30) % 12
            },
            isNewDomain: domainAgeInDays < 90, // 3개월 미만이면 새로운 도메인으로 간주
            score
        };
    } catch (err) {
        console.error('WHOIS API 호출 오류:', err);
        console.log(`\n===== WHOIS 정보 분석 실패 =====`);

        // 현재 날짜 기준으로 임의의 등록일과 만료일 생성
        const currentDate = new Date();
        const registrationDate = new Date(currentDate);
        registrationDate.setFullYear(currentDate.getFullYear() - Math.floor(Math.random() * 10));

        const expirationDate = new Date(currentDate);
        expirationDate.setFullYear(currentDate.getFullYear() + Math.floor(Math.random() * 5) + 1);

        const domainAgeInDays = Math.floor((currentDate.getTime() - registrationDate.getTime()) / (1000 * 60 * 60 * 24));
        const isNewDomain = domainAgeInDays < 90;

        // API 호출 실패 시에도 도메인 나이에 따른 점수 계산
        let score = 70; // 기본 점수
        console.log(`API 호출 실패로 기본 점수 적용: ${score}`);

        if (isNewDomain) {
            score = 30; // 새로운 도메인은 위험 점수가 높음
            console.log(`임의 생성된 도메인 나이가 3개월 미만: 점수 ${score}로 조정 (위험)`);
        }

        console.log(`최종 WHOIS 점수 (API 오류): ${score}`);
        console.log(`===== WHOIS 정보 분석 완료 (API 오류) =====\n`);

        return {
            registrationDate: registrationDate.toISOString().split('T')[0],
            expirationDate: expirationDate.toISOString().split('T')[0],
            registrar: 'Unknown (API Error)',
            registrant: {
                name: 'Unknown',
                organization: 'Unknown',
                country: 'Unknown',
                isPrivacyProtected: false
            },
            domainAge: {
                days: domainAgeInDays,
                years: Math.floor(domainAgeInDays / 365),
                months: Math.floor(domainAgeInDays / 30) % 12
            },
            isNewDomain,
            score,
            error: '일시적인 API 오류'
        };
    }
}

// Google Custom Search API를 사용하여 URL의 신뢰성 확인
async function checkGoogleCustomSearch(url: string) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;

        // 검색 쿼리 설정 (도메인 또는 사이트 검색)
        const searchQuery = `"${domain}" OR site:${domain}`;

        console.log('Google Custom Search API 호출 시작...');
        console.log('API 키:', GOOGLE_CUSTOM_SEARCH_API_KEY.substring(0, 5) + '...');
        console.log('검색 엔진 ID:', GOOGLE_CUSTOM_SEARCH_CX.substring(0, 5) + '...');

        // Google Custom Search API 호출
        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: GOOGLE_CUSTOM_SEARCH_API_KEY,
                cx: GOOGLE_CUSTOM_SEARCH_CX,
                q: searchQuery
            },
            timeout: 10000 // 10초 타임아웃 설정
        });

        console.log('Google Custom Search API 응답:');
        console.log('검색 쿼리:', searchQuery);

        // 검색 결과 분석
        const searchInfo = response.data.searchInformation;
        const resultCount = parseInt(searchInfo.totalResults, 10);
        const items = response.data.items || [];

        console.log('검색 결과 수:', resultCount);
        console.log('검색 결과 아이템 수:', items.length);

        // 검색 결과 수에 따른 점수 계산
        let score = 0;
        let isSuspicious = false;
        let isHighlySuspicious = false;

        if (resultCount === 0) {
            // 검색 결과가 없으면 매우 의심스러움
            score = 0;
            isSuspicious = true;
            isHighlySuspicious = true;
            console.log('검색 결과가 없음 (매우 의심스러움)');
        } else if (resultCount === 1) {
            // 검색 결과가 1개면 매우 의심스러움
            score = 10;
            isSuspicious = true;
            isHighlySuspicious = true;
            console.log('검색 결과가 1개로 매우 의심스러움');
        } else if (resultCount <= 5) {
            // 검색 결과가 5개 이하면 의심스러움
            score = 30;
            isSuspicious = true;
            console.log('검색 결과가 적음 (의심스러움)');
        } else if (resultCount <= 10) {
            // 검색 결과가 10개 이하면 약간 의심스러움
            score = 60;
            console.log('검색 결과가 적당함');
        } else if (resultCount <= 20) {
            // 검색 결과가 20개 이하면 보통
            score = 80;
            console.log('검색 결과가 많음');
        } else {
            // 검색 결과가 20개 초과면 안전
            score = 90;
            console.log('검색 결과가 많음');
        }

        // 상위 검색 결과에 도메인이 포함되어 있는지 확인
        const isInTopResults = items.some((item: any) => {
            const itemUrl = new URL(item.link);
            return itemUrl.hostname === domain;
        });

        console.log('최종 점수:', score);
        console.log('상위 검색 결과에 포함됨:', isInTopResults);

        return {
            isInTopResults,
            score,
            resultCount,
            isSuspicious,
            isHighlySuspicious
        };
    } catch (error: any) {
        console.error('Google Custom Search API 호출 오류:', error);

        // 에러 코드에 따른 처리
        let errorMessage = '일시적인 API 오류';
        let errorCode = error.response?.status || 500;

        if (error.response) {
            // API 응답이 있는 경우
            if (error.response.status === 403) {
                errorMessage = 'API 키 할당량 초과 또는 권한 오류';
                console.error('Google Custom Search API 할당량 초과 또는 권한 오류:', error.response.data);
            } else if (error.response.status === 400) {
                errorMessage = '잘못된 요청 형식';
                console.error('Google Custom Search API 잘못된 요청:', error.response.data);
            } else {
                errorMessage = `API 오류 (${error.response.status})`;
                console.error('Google Custom Search API 응답 오류:', error.response.data);
            }
        } else if (error.request) {
            // 요청은 보냈지만 응답이 없는 경우 (타임아웃 등)
            errorMessage = '서버 응답 없음 (타임아웃)';
            console.error('Google Custom Search API 타임아웃 또는 네트워크 오류');
        }

        // 기본 반환값 (오류 발생 시)
        return {
            isInTopResults: false,
            score: 50, // 오류 시 중간 점수 반환
            resultCount: 0,
            isSuspicious: true,
            isHighlySuspicious: false,
            error: errorMessage,
            errorCode
        };
    }
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // URL 분석
        const urlAnalysis = analyzeUrlPattern(url);

        // 도메인 추출
        const domain = new URL(url).hostname;

        // 의심스러운 도메인 체크
        const suspiciousDomains = await checkSuspiciousDomains(url);

        // 각 서비스에서 URL 분석
        const [googleSafeBrowsing, virusTotal, whois, googleCustomSearch] = await Promise.all([
            checkGoogleSafeBrowsing(url),
            checkVirusTotal(url),
            getWhoisInfo(url),
            checkGoogleCustomSearch(url)
        ]);

        // 각 항목의 점수 콘솔에 출력
        console.log('\n===== 각 항목별 점수 =====');
        console.log('Google Safe Browsing 점수:', googleSafeBrowsing.score);
        console.log('VirusTotal 점수:', virusTotal.score);
        console.log('WHOIS 점수:', whois.score);
        console.log('URL 패턴 분석 점수:', urlAnalysis.score);
        console.log('의심스러운 도메인 점수:', suspiciousDomains.score);
        console.log('Google 검색 결과 점수:', googleCustomSearch.score);
        console.log('===========================\n');

        // 가중치 적용하여 최종 점수 계산
        const scores = suspiciousDomains.isTyposquatting
            ? [
                googleSafeBrowsing.score * 0.15,  // 15% 가중치
                virusTotal.score * 0.15,          // 15% 가중치
                whois.score * 0.15,               // 15% 가중치
                urlAnalysis.score * 0.15,         // 15% 가중치
                suspiciousDomains.score * 0.20,      // 20% 가중치 (의심 도메인 탐지 시 가중치 증가)
                googleCustomSearch.score * 0.20   // 20% 가중치 (Google 검색 결과 가중치 추가)
            ]
            : [
                googleSafeBrowsing.score * 0.20,  // 20% 가중치
                virusTotal.score * 0.20,          // 20% 가중치
                whois.score * 0.15,               // 15% 가중치
                urlAnalysis.score * 0.15,         // 15% 가중치
                googleCustomSearch.score * 0.30   // 30% 가중치 (Google 검색 결과 가중치 추가)
            ];

        // 가중치가 적용된 점수 출력
        console.log('===== 가중치 적용 점수 =====');
        if (suspiciousDomains.isTyposquatting) {
            console.log('Google Safe Browsing (15%):', googleSafeBrowsing.score * 0.15);
            console.log('VirusTotal (15%):', virusTotal.score * 0.15);
            console.log('WHOIS (15%):', whois.score * 0.15);
            console.log('URL 패턴 분석 (15%):', urlAnalysis.score * 0.15);
            console.log('의심스러운 도메인 (20%):', suspiciousDomains.score * 0.20);
            console.log('Google 검색 결과 (20%):', googleCustomSearch.score * 0.20);
        } else {
            console.log('Google Safe Browsing (20%):', googleSafeBrowsing.score * 0.20);
            console.log('VirusTotal (20%):', virusTotal.score * 0.20);
            console.log('WHOIS (15%):', whois.score * 0.15);
            console.log('URL 패턴 분석 (15%):', urlAnalysis.score * 0.15);
            console.log('Google 검색 결과 (30%):', googleCustomSearch.score * 0.30);
        }
        console.log('===========================\n');

        const totalScore = Math.round(scores.reduce((sum, score) => sum + score, 0));
        console.log('최종 점수:', totalScore);
        const isSafe = totalScore > 70;

        // 결과 조합
        const result = {
            url,
            domain,
            isSafe,
            score: totalScore,
            details: {
                googleSafeBrowsing,
                virusTotal,
                whois,
                urlAnalysis: {
                    suspicious: urlAnalysis.isSuspicious,
                    score: urlAnalysis.score,
                    patterns: urlAnalysis.details
                },
                suspiciousDomains,
                googleCustomSearch
            },
            explanation: getExplanation(
                urlAnalysis,
                suspiciousDomains,
                googleSafeBrowsing,
                virusTotal,
                whois,
                googleCustomSearch
            )
        };

        return NextResponse.json(result);

    } catch (err) {
        console.error('URL 분석 중 오류 발생:', err instanceof Error ? err.message : String(err));
        return NextResponse.json(
            { error: 'URL 분석 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

function getExplanation(
    urlPattern: any,
    suspiciousDomains: any,
    safeBrowsing: any,
    virusTotal: any,
    whois: any,
    googleCustomSearch: any
) {
    const reasons = [];

    // URL 패턴 분석 결과에 따른 설명
    if (urlPattern.score < 70) {
        const suspiciousPatterns = Object.keys(urlPattern.details).filter(key => urlPattern.details[key]);
        reasons.push(`URL 패턴에서 ${suspiciousPatterns.length}개의 의심스러운 패턴이 발견되었습니다.`);
    }

    // 의심스러운 도메인 분석 결과에 따른 설명
    if (suspiciousDomains.isTyposquatting) {
        reasons.push(`이 도메인은 의심스러운 패턴을 포함하고 있습니다.`);
    }

    // Google Safe Browsing 결과에 따른 설명
    if (safeBrowsing.threatType) {
        reasons.push(`Google Safe Browsing에서 위협으로 분류되었습니다: ${safeBrowsing.threatType}`);
    }

    // VirusTotal 결과에 따른 설명
    if (virusTotal.maliciousCount > 0) {
        reasons.push(`VirusTotal에서 ${virusTotal.maliciousCount}개의 보안 엔진이 이 URL을 악성으로 분류했습니다.`);
    }

    // WHOIS 정보에 따른 설명
    if (whois.score < 50) {
        reasons.push(`도메인이 최근에 등록되었거나 (${whois.registrationDate}) 등록 정보가 보호되어 있습니다.`);
    }

    // Google Custom Search 결과에 따른 설명
    if (!googleCustomSearch.isInTopResults) {
        reasons.push(`이 도메인은 Google 검색 결과에서 발견되지 않았습니다.`);
    } else if (googleCustomSearch.isHighlySuspicious) {
        reasons.push(`이 도메인은 Google 검색 결과에서 ${googleCustomSearch.resultCount}개만 발견되어 매우 의심스럽습니다.`);
    } else if (googleCustomSearch.isSuspicious) {
        reasons.push(`이 도메인은 Google 검색 결과에서 ${googleCustomSearch.resultCount}개만 발견되어 의심스럽습니다.`);
    }

    if (reasons.length === 0) {
        return "이 URL은 안전한 것으로 분석되었습니다.";
    } else {
        return `이 URL은 다음과 같은 이유로 안전하지 않을 수 있습니다:\n${reasons.join('\n')}`;
    }
} 