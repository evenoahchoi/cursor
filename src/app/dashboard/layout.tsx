import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 전체 화면을 차지하고, 내부 요소를 가로로 배치 (사이드바 | 오른쪽 영역)
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 고정 */}
      <Sidebar />

      {/* 오른쪽 영역: 헤더와 메인 컨텐츠를 세로로 배치 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 고정 */}
        <Header />

        {/* 메인 컨텐츠 영역 */}
        <main className="flex-1 overflow-y-auto">
          {/* 페이지 컴포넌트(children)가 렌더링되는 곳 */}
          {children}
        </main>
      </div>
    </div>
  );
} 