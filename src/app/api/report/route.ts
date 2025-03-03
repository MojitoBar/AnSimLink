import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// 신고 데이터를 저장할 간단한 배열 (실제로는 데이터베이스에 저장해야 함)
const reports: Array<{
    url: string;
    description: string;
    reporterEmail: string;
    date: string;
}> = [];

// 이메일 전송을 위한 트랜스포터 설정
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com', // 실제 서비스에서는 환경 변수 사용 권장
        pass: process.env.EMAIL_APP_PASSWORD || 'your-app-password' // Gmail의 경우 앱 비밀번호 사용 필요
    }
});

export async function POST(request: NextRequest) {
    try {
        const { url, email, description } = await request.json();

        if (!url || !description) {
            return NextResponse.json(
                { error: '필수 정보가 누락되었습니다.' },
                { status: 400 }
            );
        }

        // 신고 정보 저장
        const reportData = {
            url,
            description,
            reporterEmail: email || '익명',
            date: new Date().toISOString()
        };

        reports.push(reportData);

        // 이메일 전송
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: 'wnehdtjr5@gmail.com',
                subject: '[AnSim-Link] 새로운 피싱 사이트 신고',
                html: `
                    <h2>새로운 피싱 사이트 신고가 접수되었습니다</h2>
                    <p><strong>신고 URL:</strong> ${url}</p>
                    <p><strong>신고자 이메일:</strong> ${email || '익명'}</p>
                    <p><strong>신고 일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
                    <p><strong>상세 설명:</strong></p>
                    <p>${description.replace(/\n/g, '<br>')}</p>
                `
            });
            console.log('신고 이메일이 성공적으로 전송되었습니다.');
        } catch (emailError) {
            console.error('이메일 전송 중 오류 발생:', emailError);
            // 이메일 전송 실패해도 신고는 저장됨
        }

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