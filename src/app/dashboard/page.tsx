"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  UsersIcon,
  CurrencyDollarIcon,
  ClipboardIcon,
  CalendarIcon,
  BriefcaseIcon
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
    <div className={`bg-white p-4 rounded-card shadow-card hover:shadow-md transition-shadow duration-300 ${className}`}>
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
  const { status } = useSession(); // status만 받도록 수정

  // --- 더미 데이터 ---
  const totalCustomers = 120;
  const activeTasks = 15;
  const totalRevenue = 5280000;
  const pendingTasks = 5;

  const customerData = [
    { name: '활성 고객', value: 95, color: '#4A90E2' }, // primary color
    { name: '비활성 고객', value: 25, color: '#D0021B' }, // danger color (예시)
  ];

  const taskData = [
    { name: '진행 중', value: 15, color: '#4A90E2' }, // primary
    { name: '시작 전', value: 5, color: '#F5A623' }, // 오렌지 계열 (예시)
    { name: '완료', value: 50, color: '#7ED321' }, // secondary (green)
  ];

  const priorityTasks = [
      { id: 'task-001', title: '신규 고객 온보딩 미팅', customerName: '김민준', priority: 'high' },
      { id: 'task-002', title: '프로젝트 제안서 작성 완료 - 고객사 피드백 요청 예정', customerName: '이서연', priority: 'high' },
      { id: 'task-003', title: '월간 보고서 발송', customerName: '박지훈', priority: 'medium' },
  ];

  // --- 로딩 및 인증 상태 처리 --- (useSession status 사용)
  if (status === "loading") {
    return <div className="flex justify-center items-center flex-1">로딩 스피너...</div>;
  }
  if (status === "unauthenticated") {
    return <div className="flex justify-center items-center flex-1">로그인이 필요합니다.</div>;
  }

  // --- 렌더링 ---
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-[16px] gap-y-[24px]">

      {/* 지표 카드들 ... (ClipboardIcon 사용) */}
      <DashboardCard
          icon={<UsersIcon className="h-5 w-5" />}
          title="총 고객"
          iconBgColor="bg-blue-100 text-primary"
      >
          <p className="text-xl font-bold text-text-primary">{totalCustomers}명</p>
      </DashboardCard>
      <DashboardCard
          icon={<BriefcaseIcon className="h-5 w-5" />}
          title="진행중 / 시작전"
          iconBgColor="bg-yellow-100 text-yellow-600"
      >
          <p className="text-xl font-bold text-text-primary">{activeTasks} / {pendingTasks}건</p>
      </DashboardCard>
      <DashboardCard
          icon={<CurrencyDollarIcon className="h-5 w-5" />}
          title="총 매출"
          iconBgColor="bg-green-100 text-secondary"
      >
          <p className="text-xl font-bold text-text-primary">{(totalRevenue / 10000).toLocaleString()}만원</p>
      </DashboardCard>
      <DashboardCard
          icon={<CalendarIcon className="h-5 w-5" />}
          title="오늘 마감"
          iconBgColor="bg-red-100 text-danger"
      >
          <p className="text-xl font-bold text-text-primary">2건</p>
      </DashboardCard>

      {/* 차트 카드들 ... (변경 없음) */}
      <DashboardCard
          title="고객 분포"
          className="sm:col-span-1"
      >
           <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                       <Pie
                           data={customerData} /* Use appropriate data */
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
          title="업무 상태"
          className="sm:col-span-1"
      >
           <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                       <Pie
                           data={taskData} /* Use appropriate data */
                           cx="50%"
                           cy="50%"
                           innerRadius={50}
                           outerRadius={70}
                           fill="#8884d8"
                           paddingAngle={5}
                           dataKey="value"
                           labelLine={false}
                       >
                           {taskData.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                       </Pie>
                       <Tooltip formatter={(value) => `${value}건`} />
                   </PieChart>
               </ResponsiveContainer>
           </div>
      </DashboardCard>

      {/* 우선순위 업무 목록 카드 (ClipboardIcon 사용) */}
      <DashboardCard
          icon={<ClipboardIcon className="h-5 w-5" />}
          title="우선순위 업무"
          iconBgColor="bg-purple-100 text-purple-600"
          className="sm:col-span-2 lg:col-span-3"
      >
          {priorityTasks.length > 0 ? (
              <ul className="space-y-2 mt-1">
                  {priorityTasks.map(task => (
                      <li key={task.id} className="flex justify-between items-center text-xs border-b border-gray-200 pb-1 last:border-b-0">
                          <span className="text-text-primary truncate">{task.title}</span>
                          <span className={`px-2 py-px rounded-full text-xs font-medium 
                              ${task.priority === 'high' ? 'bg-red-100 text-danger' : 'bg-yellow-100 text-yellow-700'}
                          `}>
                              {task.priority === 'high' ? '높음' : '중간'}
                          </span>
                      </li>
                  ))}
              </ul>
          ) : (
              <p className="text-text-secondary text-center py-4">우선순위 업무가 없습니다.</p>
          )}
      </DashboardCard>

    </div>
  );
} 