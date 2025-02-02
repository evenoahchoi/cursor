import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

interface Post {
  _id: ObjectId; // MongoDB의 ObjectId 타입 사용. 만약 문자열로 다루고 싶다면 string으로 변경하세요.
  title: string;
  content: string;
  date: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
): Promise<void> {
  const uri = process.env.MONGO_URI;
  
  if (!uri) {
    res.status(500).json({ error: 'MongoDB URI가 설정되지 않았습니다.' });
    return;
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('eventlog');
    const collection = database.collection<Post>('pagetest');

    // 데이터 조회 및 최신순으로 정렬 (date 필드를 기준으로 내림차순 정렬)
    const data = await collection.find({}).sort({ date: -1 }).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error('데이터 조회 중 오류 발생:', error);
    res.status(500).json({ error: '데이터를 가져오는 데 실패했습니다.' });
  } finally {
    await client.close();
  }
}
