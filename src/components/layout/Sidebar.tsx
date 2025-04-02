import React from 'react';
import Link from 'next/link';
// import { HomeIcon, UsersIcon, BriefcaseIcon, CreditCardIcon } from '@heroicons/react/24/outline'; // 예시 아이콘 임포트

// 임시 메뉴 데이터
const menuItems = [
  { name: '대시보드', href: '/dashboard', /* icon: HomeIcon */ },
  { name: '고객 관리', href: '/dashboard/customers', /* icon: UsersIcon */ },
  { name: '업무 관리', href: '/dashboard/tasks', /* icon: BriefcaseIcon */ },
  { name: '결제 관리', href: '/dashboard/payments', /* icon: CreditCardIcon */ },
];

export default function Sidebar() {
  // 현재 경로를 파악하여 활성 메뉴 표시 (구현 필요)
  // const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-md hidden md:block"> {/* md 이상 화면에서 보임 */}
      <div className="p-6">
        {/* 로고 영역 */}
        <Link href="/dashboard" className="text-2xl font-bold text-primary mb-8 block">
          MyCon
        </Link>

        {/* 메뉴 리스트 */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 
                         ${ /* 활성 메뉴 스타일링 (예: bg-blue-50 text-primary) */ 
                           'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                         }`}
            >
              {/* 아이콘 영역 (Heroicons 등 사용) */}
              {/* <item.icon className="h-5 w-5 mr-3" /> */}
              <span className="w-5 h-5 mr-3"></span> {/* 임시 아이콘 공간 */}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
} 