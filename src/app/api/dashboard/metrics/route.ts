import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 데이터를 조회해야 합니다.
  const dummyMetrics = {
    totalCustomers: 120,
    activeTasks: 15,
    totalRevenue: 5280000, // 예: 5,280,000원
    pendingTasks: 5,
  };

  try {
    // 여기서 실제 데이터 로직을 추가할 수 있습니다.
    // 예: const metrics = await getMetricsFromDB();
    // return NextResponse.json(metrics);

    // 현재는 더미 데이터 반환
    return NextResponse.json(dummyMetrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
} 