"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, CalendarDays } from 'lucide-react';
// 차트 라이브러리 (예: Recharts) - 필요시 설치 및 임포트
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 더미 데이터 (차트용)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummyRevenueData = [
  { month: '1월', revenue: 4000000 },
  { month: '2월', revenue: 3000000 },
  { month: '3월', revenue: 5000000 },
  { month: '4월', revenue: 4500000 },
  { month: '5월', revenue: 6000000 },
  { month: '6월', revenue: 5500000 },
  { month: '7월', revenue: 7500000 }, // 현재 월 (예상치)
];

// --- 공용 요약 카드 ---
interface SummaryCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

function SummaryCard({ title, value, icon, description }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}


export default function AnalyticsPage() {
  // 실제 데이터는 API 호출 등을 통해 가져와야 합니다.
  const totalRevenueThisMonth = 7500000;
  const revenueChange = "+20.1%"; // 전월 대비 증감률 (더미)
  const newCustomersThisMonth = 15;
  const averageBookingValue = 135000;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">수익 분석</h1>

      {/* 요약 지표 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="이번 달 총 수익"
          value={`${(totalRevenueThisMonth / 10000).toLocaleString()}만원`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description={`${revenueChange} 전월 대비`}
        />
        <SummaryCard
          title="평균 예약 금액"
          value={`${averageBookingValue.toLocaleString()}원`}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          description="지난 30일 기준"
        />
         <SummaryCard
          title="이번 달 신규 고객"
          value={`+${newCustomersThisMonth}명`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="신규 유입 고객 수"
        />
        <SummaryCard
          title="월별 수익 추세 (임시)" // 이 카드는 실제 차트로 대체될 수 있음
          value="우상향" // 실제 값이나 추세 표시
          icon={<CalendarDays className="h-4 w-4 text-muted-foreground" />}
          description="지난 6개월 기준"
        />
      </div>

      {/* 월별 수익 추세 차트 */}
      <Card>
        <CardHeader>
          <CardTitle>월별 수익 추세</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          {/* 차트 컴포넌트가 들어갈 자리 */}
          {/* 예시: Recharts 사용 시 */}
          {/* <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dummyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 10000)}만원`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString()}원`, "수익"]} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="월별 수익" />
            </LineChart>
          </ResponsiveContainer> */}
           <div className="flex items-center justify-center h-full text-muted-foreground">
             차트 라이브러리를 설치하고 여기에 차트를 구현하세요. (예: Recharts, Chart.js)
           </div>
        </CardContent>
      </Card>

      {/* 추가 분석 섹션 (예: 서비스별 수익, 고객 세그먼트별 수익 등) */}
      {/* <Card>...</Card> */}

    </div>
  );
}
