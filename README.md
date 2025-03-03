# AnSim-Link: 피싱 링크 판별 서비스

AnSim-Link는 사용자가 의심스러운 URL을 입력하면 해당 사이트의 피싱 위험도를 분석하여 안전성을 평가해주는 웹 서비스입니다.

## 주요 기능

- **URL 분석 시스템**: 입력된 URL을 다양한 보안 데이터베이스와 알고리즘을 통해 분석하여 위험 요소를 탐지합니다.
- **위험도 점수 및 등급 표시**: Google Safe Browsing, VirusTotal, WHOIS 정보 등을 종합하여 URL의 안전성을 점수로 제공합니다.
- **위험 요소 상세 설명**: 발견된 위험 요소에 대한 상세 정보를 제공하여 사용자가 이해하기 쉽게 설명합니다.
- **피싱 의심 사이트 신고 기능**: 새로운 피싱 사이트를 발견했을 때 신고할 수 있는 기능을 제공합니다.

## 사용된 기술

- **프론트엔드**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI
- **백엔드**: Next.js API Routes
- **분석 도구**: Google Safe Browsing API, VirusTotal API, WHOIS API

## 설치 및 실행 방법

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone https://github.com/yourusername/ansimlink.git
cd ansimlink

# 의존성 설치
npm install
# 또는
yarn install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 http://localhost:3000 으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

```bash
npm run build
npm run start
# 또는
yarn build
yarn start
```

## API 키 설정 (실제 서비스 구현 시)

실제 서비스 구현 시 다음 API 키를 환경 변수로 설정해야 합니다:

1. `.env.local` 파일을 프로젝트 루트에 생성
2. 다음 환경 변수 추가:

```
GOOGLE_SAFE_BROWSING_API_KEY=your_api_key_here
VIRUSTOTAL_API_KEY=your_api_key_here
WHOIS_API_KEY=your_api_key_here
GOOGLE_CUSTOM_SEARCH_API_KEY=your_api_key_here
GOOGLE_CUSTOM_SEARCH_CX=your_search_engine_id_here
```

### Vercel 배포 시 환경 변수 설정

Vercel에 배포할 때는 Vercel 대시보드에서 환경 변수를 설정해야 합니다:

1. Vercel 프로젝트 대시보드에 접속
2. Settings > Environment Variables 메뉴로 이동
3. 위의 환경 변수들을 추가
4. 변경사항 저장 후 재배포

### Vercel 배포 방법

1. [Vercel](https://vercel.com/)에 가입하고 로그인합니다.
2. 새 프로젝트를 생성하고 GitHub 저장소를 연결합니다.
3. 프로젝트 설정에서 다음 사항을 확인합니다:
   - Framework Preset: Next.js
   - Root Directory: ansimlink (프로젝트 루트 디렉토리)
   - Build Command: next build
   - Output Directory: .next
4. 환경 변수를 설정합니다 (위 '환경 변수 설정' 참조).
5. 배포 버튼을 클릭하여 배포를 시작합니다.

배포가 완료되면 Vercel에서 제공하는 도메인으로 서비스에 접근할 수 있습니다.

## 프로젝트 구조

```
ansimlink/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts
│   │   │   └── report/
│   │   │       └── route.ts
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── report/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   └── ... (UI 컴포넌트)
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── url-form.tsx
│   └── lib/
│       └── utils.ts
├── public/
├── .env.local
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
```

## 라이센스

MIT

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 연락처

프로젝트 관리자 - wnehdtjr5@gmail.com
