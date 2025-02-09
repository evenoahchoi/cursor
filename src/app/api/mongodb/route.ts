// app/api/mongodb/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb'; // 경로는 프로젝트 구조에 맞게 조정하세요

export async function GET() {
  try {
    const db = await dbConnect();
    const logs = await db.collection('pagetest').find({}).toArray();
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("MongoDB 연결 오류:", error);
    return NextResponse.json({ error: '데이터를 불러오는 중 오류 발생' }, { status: 500 });
  }
}
