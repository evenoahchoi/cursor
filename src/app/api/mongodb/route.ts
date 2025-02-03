//app/api/mongodb/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../utils/database'; // 올바르게 임포트

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('eventlog'); // eventlog 데이터베이스 사용
    const logs = await db.collection('pagetest').find({}).toArray(); // pagetest 컬렉션에서 데이터 조회
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("MongoDB 연결 오류:", error);
    return NextResponse.json({ error: '데이터를 불러오는 중 오류 발생' }, { status: 500 });
  }
}
