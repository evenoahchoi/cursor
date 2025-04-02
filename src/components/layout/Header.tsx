"use client"; // useSession 사용 위해 클라이언트 컴포넌트로

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
// import { BellIcon } from '@heroicons/react/24/outline'; // 예시 아이콘

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 좌측 영역 (예: 햄버거 메뉴 - 모바일용) */}
          <div className="md:hidden">
            {/* 모바일 사이드바 토글 버튼 구현 필요 */}
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <div className="hidden md:block"></div> { /* 레이아웃 유지용 */}

          {/* 우측 영역: 알림, 프로필, 로그아웃 */}
          <div className="flex items-center space-x-4">
            {/* 알림 아이콘 */}
            <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <span className="sr-only">View notifications</span>
              {/* <BellIcon className="h-6 w-6" aria-hidden="true" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
               </svg> { /* 임시 아이콘 */}
            </button>

            {/* 사용자 프로필 */}
            <div className="flex items-center space-x-2">
              <Image
                className="h-8 w-8 rounded-full"
                src={session?.user?.image || '/default-avatar.png'} // 기본 아바타 이미지 경로 필요
                alt="User avatar"
                width={32}
                height={32}
              />
              <span className="hidden sm:block text-sm font-medium text-text-primary">
                {session?.user?.name}
              </span>
            </div>

            {/* 로그아웃 버튼 */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 