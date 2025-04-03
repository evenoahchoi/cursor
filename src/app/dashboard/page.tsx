"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

// --- 공용 카드 컴포넌트 ---
interface DashboardCardProps {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  iconBgColor?: string;
}

function DashboardCard({ icon, title, children, className = '', iconBgColor = 'bg-blue-100 text-blue-600' }: DashboardCardProps) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-300 ${className}`}>
      <div className="flex items-center mb-3">
        {icon && (
          <div className={`flex items-center justify-center h-8 w-8 rounded-full mr-2 ${iconBgColor}`}>
            {icon}
          </div>
        )}
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
}

// --- 대시보드 페이지 컴포넌트 ---

export default function DashboardPage() {
  const { status } = useSession();

  // --- 더미 데이터 ---
  const todaysBookings = 5;
  const expectedRevenue = 7500000;
  const newReviews = 3;
  const totalCustomers = 128;

  const customerData = [
    { name: '활성 고객', value: 100, color: '#4A90E2' },
    { name: '비활성 고객', value: 28, color: '#D0021B' },
  ];

  const revenueData = [
    { name: '서비스 A', value: 4000000, color: '#4A90E2' },
    { name: '서비스 B', value: 2500000, color: '#7ED321' },
    { name: '서비스 C', value: 1000000, color: '#F5A623' },
  ];

  const recentBookings = [
    { id: 'bk-001', customerName: '김예지', serviceName: '1:1 커리어 컨설팅', date: '2024-07-28', status: '확정' },
    { id: 'bk-002', customerName: '박현우', serviceName: '포트폴리오 리뷰', date: '2024-07-27', status: '완료' },
    { id: 'bk-003', customerName: '이지은', serviceName: '면접 대비 특강', date: '2024-07-27', status: '확정' },
    { id: 'bk-004', customerName: '최민석', serviceName: '1:1 커리어 컨설팅', date: '2024-07-26', status: '완료' },
    { id: 'bk-005', customerName: '정다희', serviceName: '자소서 첨삭', date: '2024-07-26', status: '취소' },
  ];

  // --- 로딩 및 인증 상태 처리 ---
  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }
  if (status === "unauthenticated") {
    return <div className="flex justify-center items-center h-screen">로그인이 필요합니다.</div>;
  }

  // --- 렌더링 ---
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">대시보드</h1>

      {/* 핵심 지표 카드 섹션 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          icon={<CalendarDaysIcon className="h-5 w-5" />}
          title="오늘 예약 건수"
          iconBgColor="bg-blue-100 text-blue-600"
        >
          <p className="text-xl font-bold text-text-primary">{todaysBookings}건</p>
        </DashboardCard>
        <DashboardCard
          icon={<CurrencyDollarIcon className="h-5 w-5" />}
          title="월 예상 수익"
          iconBgColor="bg-green-100 text-green-600"
        >
          <p className="text-xl font-bold text-text-primary">{(expectedRevenue / 10000).toLocaleString()}만원</p>
        </DashboardCard>
        <DashboardCard
          icon={<ChatBubbleLeftRightIcon className="h-5 w-5" />}
          title="신규 리뷰"
          iconBgColor="bg-yellow-100 text-yellow-600"
        >
          <p className="text-xl font-bold text-text-primary">{newReviews}개</p>
        </DashboardCard>
        <DashboardCard
          icon={<UsersIcon className="h-5 w-5" />}
          title="총 고객 수"
          iconBgColor="bg-purple-100 text-purple-600"
        >
          <p className="text-xl font-bold text-text-primary">{totalCustomers}명</p>
        </DashboardCard>
      </div>

      {/* 그래프 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard
          title="고객 분포"
          className="lg:col-span-1"
        >
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}명`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        <DashboardCard
          title="수익 분포 (서비스별)"
          className="lg:col-span-1"
        >
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  labelLine={false}
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${(Number(value) / 10000).toLocaleString()}만원`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* 최근 예약 목록 */}
      <DashboardCard
        icon={<ClipboardDocumentListIcon className="h-5 w-5" />}
        title="최근 예약 목록"
        iconBgColor="bg-indigo-100 text-indigo-600"
        className="col-span-1 lg:col-span-2"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">예약 ID</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">고객명</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">서비스명</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">예약일</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-text-secondary">{booking.id}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-text-primary">{booking.customerName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-text-secondary">{booking.serviceName}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-text-secondary">{booking.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === '확정' ? 'bg-blue-100 text-blue-800' :
                       booking.status === '완료' ? 'bg-green-100 text-green-800' :
                       booking.status === '취소' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentBookings.length === 0 && (
          <p className="text-text-secondary text-center py-4">최근 예약 내역이 없습니다.</p>
        )}
      </DashboardCard>

    </div>
  );
} 