'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FiAlertTriangle, FiSend } from 'react-icons/fi';

const reportSchema = z.object({
    url: z.string().url('유효한 URL을 입력해주세요'),
    email: z.string().email('유효한 이메일을 입력해주세요').optional().or(z.literal('')),
    description: z.string().min(10, '최소 10자 이상 입력해주세요').max(500, '최대 500자까지 입력 가능합니다')
});

type FormValues = z.infer<typeof reportSchema>;

export default function ReportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(reportSchema),
        defaultValues: {
            url: '',
            email: '',
            description: ''
        }
    });

    async function onSubmit(data: FormValues) {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '신고 제출 중 오류가 발생했습니다.');
            }

            setIsSuccess(true);
            form.reset();
        } catch (err: any) {
            setError(err.message || '신고 제출 중 오류가 발생했습니다. 다시 시도해주세요.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 py-16 px-4">
                <div className="container mx-auto max-w-3xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-6">
                            피싱 사이트 신고
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            의심스러운 피싱 사이트를 발견하셨나요? 아래 양식으로 신고해주시면 검토 후 다른 사용자들도 보호할 수 있어요.
                        </p>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            {isSuccess ? (
                                <Alert className="bg-green-50 text-green-800 border-green-500">
                                    <AlertTitle className="text-lg font-semibold">신고가 접수되었습니다</AlertTitle>
                                    <AlertDescription>
                                        소중한 신고 감사합니다! 검토 후 데이터베이스에 추가해 다른 사용자들도 함께 보호하겠습니다.
                                        <div className="mt-4">
                                            <Button onClick={() => setIsSuccess(false)} variant="outline">
                                                새 신고 작성하기
                                            </Button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="url"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>피싱 의심 URL</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="https://example.com"
                                                            {...field}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        신고하려는 피싱 의심 사이트의 전체 URL을 입력해주세요.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>이메일 (선택사항)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="your@email.com"
                                                            {...field}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        신고 처리 결과를 받아보시려면 이메일을 입력해주세요.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>상세 설명</FormLabel>
                                                    <FormControl>
                                                        <textarea
                                                            className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            placeholder="해당 사이트가 왜 피싱 사이트라고 생각하시나요? 어떤 특징이 의심스러운지 설명해주세요."
                                                            {...field}
                                                            disabled={isSubmitting}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        해당 URL이 피싱 사이트라고 판단한 이유를 자세히 설명해주세요.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {error && (
                                            <Alert variant="destructive">
                                                <FiAlertTriangle className="h-4 w-4" />
                                                <AlertTitle>오류</AlertTitle>
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <Button type="submit" disabled={isSubmitting} className="w-full">
                                            {isSubmitting ? '제출 중...' : <><FiSend className="mr-2" /> 신고하기</>}
                                        </Button>
                                    </form>
                                </Form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
} 