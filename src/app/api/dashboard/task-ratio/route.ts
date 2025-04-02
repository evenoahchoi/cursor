import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 데이터를 조회해야 합니다.
  const dummyTaskRatio = [
    { id: 'active', label: '진행중 업무', value: 15 },
    { id: 'pending', label: '시작전 업무', value: 5 },
    { id: 'completed', label: '완료 업무', value: 50 }, // 완료된 업무도 포함하여 전체 비율 표시
  ];

  try {
    // 여기서 실제 데이터 로직을 추가할 수 있습니다.
    // 예: const ratio = await getTaskRatioFromDB();
    // return NextResponse.json(ratio);

    // 현재는 더미 데이터 반환
    return NextResponse.json(dummyTaskRatio);
  } catch (error) {
    console.error('Error fetching task ratio:', error);
    return NextResponse.json({ error: 'Failed to fetch task ratio' }, { status: 500 });
  }
} 