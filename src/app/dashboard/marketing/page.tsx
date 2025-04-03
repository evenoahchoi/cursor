"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Ticket, Annoyed, BarChartBig } from 'lucide-react'; // 관련 아이콘 추가
import Link from 'next/link'; // Link 컴포넌트 추가

// 마케팅 도구 메뉴 항목 타입 정의 (예시)
interface MarketingTool {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType; // Lucide 아이콘 컴포넌트
  href: string; // 연결될 상세 페이지 경로
  status?: 'active' | 'coming_soon' | 'disabled'; // 기능 상태 (옵션)
}

// 마케팅 도구 목록 데이터 (예시)
const marketingTools: MarketingTool[] = [
  {
    id: 'coupon',
    title: '쿠폰 관리',
    description: '고객에게 할인 쿠폰을 발급하고 관리합니다.',
    icon: Ticket,
    href: '/dashboard/marketing/coupons', // 상세 페이지 경로 (예시)
    status: 'active',
  },
  {
    id: 'notice',
    title: '공지사항 관리',
    description: '고객에게 전달할 공지사항을 작성하고 관리합니다.',
    icon: Megaphone,
    href: '/dashboard/marketing/notices', // 상세 페이지 경로 (예시)
    status: 'active',
  },
   {
    id: 'promotion',
    title: '프로모션 관리',
    description: '기간 한정 할인 등 특별 프로모션을 생성하고 관리합니다.',
    icon: Annoyed, // 예시 아이콘, 적절한 것으로 변경 필요
    href: '/dashboard/marketing/promotions', // 상세 페이지 경로 (예시)
    status: 'coming_soon', // '출시 예정' 상태
  },
  {
    id: 'analytics',
    title: '마케팅 분석',
    description: '쿠폰 사용률, 프로모션 효과 등 마케팅 활동 성과를 분석합니다.',
    icon: BarChartBig,
    href: '/dashboard/marketing/analytics', // 상세 페이지 경로 (예시)
    status: 'coming_soon', // '출시 예정' 상태
  },
];

export default function MarketingToolsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">마케팅 도구</h1>
      <p className="text-muted-foreground">
        고객 참여를 유도하고 판매를 촉진하기 위한 다양한 마케팅 도구를 활용해보세요.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {marketingTools.map((tool) => {
          const Icon = tool.icon;
          const isComingSoon = tool.status === 'coming_soon';
          const isDisabled = tool.status === 'disabled';
          const cardClasses = `flex flex-col justify-between h-full ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md transition-shadow'}`;
          const linkClasses = `mt-4 ${isComingSoon || isDisabled ? 'pointer-events-none' : ''}`; // 클릭 비활성화

          return (
            <Card key={tool.id} className={cardClasses}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  {isComingSoon && (
                     <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                       출시 예정
                     </span>
                   )}
                   {isDisabled && (
                     <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                       비활성
                     </span>
                   )}
                </div>
                <p className="text-sm text-muted-foreground pt-1">{tool.description}</p>
              </CardHeader>
              <CardContent>
                <Link href={tool.href} passHref legacyBehavior>
                  <a className={linkClasses}>
                    <Button variant="outline" disabled={isComingSoon || isDisabled} className="w-full">
                      {isComingSoon ? '준비 중' : '관리하기'}
                    </Button>
                  </a>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
