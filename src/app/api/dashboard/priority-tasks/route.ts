import { NextResponse } from 'next/server';

export interface PriorityTask {
  id: string;
  title: string;
  customerName: string;
  dueDate: string; // ISO 8601 형식 날짜 문자열 (예: '2024-08-15T00:00:00Z')
  priority: 'high' | 'medium' | 'low';
}

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 우선순위가 높은 업무를 조회해야 합니다.
  const dummyPriorityTasks: PriorityTask[] = [
    {
      id: 'task-001',
      title: '신규 고객 온보딩 미팅',
      customerName: '김민준',
      dueDate: '2024-07-30T00:00:00Z',
      priority: 'high',
    },
    {
      id: 'task-002',
      title: '프로젝트 제안서 작성 완료',
      customerName: '이서연',
      dueDate: '2024-08-02T00:00:00Z',
      priority: 'high',
    },
    {
      id: 'task-003',
      title: '월간 보고서 발송',
      customerName: '박지훈 (주식회사 ABC)',
      dueDate: '2024-08-05T00:00:00Z',
      priority: 'medium',
    },
    {
      id: 'task-004',
      title: '기존 계약 갱신 논의',
      customerName: '최수현',
      dueDate: '2024-08-10T00:00:00Z',
      priority: 'medium',
    },
  ];

  try {
    // 여기서 실제 데이터 로직을 추가할 수 있습니다.
    // 예: const tasks = await getPriorityTasksFromDB();
    // return NextResponse.json(tasks);

    // 현재는 더미 데이터 반환
    return NextResponse.json(dummyPriorityTasks);
  } catch (error) {
    console.error('Error fetching priority tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch priority tasks' }, { status: 500 });
  }
} 