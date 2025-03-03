import { NextRequest, NextResponse } from 'next/server';

// 신고 데이터를 저장할 간단한 배열 (실제로는 데이터베이스에 저장해야 함)
const reports: Array<{
    url: string;
    description: string;
    reporterEmail: string;
    date: string;
}> = [];

export async function POST(request: NextRequest) {
    try {
        const { url, description, reporterEmail } = await request.json();

        if (!url || !description) {
            return NextResponse.json(
                { error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 신고 정보 저장
        reports.push({
            url,
            description,
            reporterEmail: reporterEmail || '익명',
            date: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('피싱 신고 처리 중 오류 발생:', err);
        return NextResponse.json(
            { error: '신고 처리 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function GET() {
    // 관리자만 접근할 수 있도록 인증 로직이 필요함 (실제 구현 시)
    return NextResponse.json({ reports });
} 