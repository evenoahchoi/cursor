import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 구현에서는 데이터베이스에서 데이터를 조회해야 합니다.
  const dummyCustomerRatio = [
    { id: 'active', label: '활성 고객', value: 95 },
    { id: 'inactive', label: '비활성 고객', value: 25 },
  ];

  try {
    // 여기서 실제 데이터 로직을 추가할 수 있습니다.
    // 예: const ratio = await getCustomerRatioFromDB();
    // return NextResponse.json(ratio);

    // 현재는 더미 데이터 반환
    return NextResponse.json(dummyCustomerRatio);
  } catch (error) {
    console.error('Error fetching customer ratio:', error);
    return NextResponse.json({ error: 'Failed to fetch customer ratio' }, { status: 500 });
  }
} 