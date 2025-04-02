import React from 'react';
import Sidebar from '@/components/layout/Sidebar'; // 사이드바 컴포넌트 (생성 예정)
import Header from '@/components/layout/Header';   // 헤더 컴포넌트 (생성 예정)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 영역 (헤더 + 컨텐츠) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <Header />

        {/* 메인 컨텐츠 */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 