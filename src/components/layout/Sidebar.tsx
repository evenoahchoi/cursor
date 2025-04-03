"use client"; // usePathname 사용 위해

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // 현재 경로 확인
import {
  HomeIcon, // 대시보드
  CalendarDaysIcon, // 예약 관리
  UsersIcon, // 고객 관리
  ClipboardDocumentListIcon, // 서비스 관리 (Briefcase 대신)
  ChartBarIcon, // 수익 분석
  ChatBubbleLeftEllipsisIcon, // 메시지 센터
  MegaphoneIcon, // 광고/마케팅
  QuestionMarkCircleIcon // 도움말 및 지원
} from '@heroicons/react/24/outline';

// 메뉴 아이템 정의 (새로운 구성)
const menuItems = [
  { href: '/dashboard', label: '대시보드', icon: HomeIcon },
  { href: '/dashboard/bookings', label: '예약 관리', icon: CalendarDaysIcon },
  { href: '/dashboard/customers', label: '고객 관리', icon: UsersIcon },
  { href: '/dashboard/services', label: '서비스 관리', icon: ClipboardDocumentListIcon },
  { href: '/dashboard/analytics', label: '수익 분석', icon: ChartBarIcon },
  { href: '/dashboard/messages', label: '메시지 센터', icon: ChatBubbleLeftEllipsisIcon },
  { href: '/dashboard/marketing', label: '마케팅 도구', icon: MegaphoneIcon },
  { href: '/dashboard/support', label: '도움말/지원', icon: QuestionMarkCircleIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white shadow-lg hidden md:flex md:flex-col flex-shrink-0">
      {/* 상단 로고 영역: 헤더와 동일한 높이, 하단 경계선 */}
      <div className="flex items-center justify-center h-16 border-b">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          MyCon
        </Link>
      </div>
      {/* 메뉴 목록: 스크롤 가능 */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1"> {/* pt-6 제거하고 기본 패딩 사용 */}
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
            >
              <Icon className={`h-5 w-5 mr-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      {/* 사이드바 하단 영역 (예: 설정 버튼 등) - 필요시 추가 */}
      {/* <div className="p-4 border-t">
        Setting button or user info
      </div> */}
    </aside>
  );
} 