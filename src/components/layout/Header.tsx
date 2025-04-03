"use client"; // useSession 사용 위해 클라이언트 컴포넌트로

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { BellIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { data: session } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div></div>
          <div className="hidden md:flex md:space-x-4">
            {/* 중앙 메뉴 항목들 (예: Link 컴포넌트) */}
          </div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="p-1 rounded-full text-gray-400 hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative">
              <span className="sr-only">알림 보기</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">사용자 메뉴 열기</span>
                <Image
                  className="h-8 w-8 rounded-full"
                  src={session?.user?.image || '/default-avatar.png'}
                  alt="User avatar"
                  width={32}
                  height={32}
                />
              </button>
              {isProfileMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-text-primary truncate">{session?.user?.name}</p>
                    <p className="text-xs text-text-secondary truncate">{session?.user?.email}</p>
                  </div>
                  <Link href="/dashboard/settings"
                    className="flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-gray-100"
                    role="menuitem" tabIndex={-1} onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-2" /> 계정 설정
                  </Link>
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setIsProfileMenuOpen(false); }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-danger hover:bg-gray-100"
                    role="menuitem" tabIndex={-1}
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" /> 로그아웃
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 