import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";
const dbName = "mycon";
const collectionName = "users";

if (!uri) {
  throw new Error("⚠️ MONGODB_URI 환경 변수가 설정되지 않았습니다.");
}

let client: MongoClient;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(dbName).collection(collectionName);
}

export async function GET() {
  try {
    const collection = await connectDB();
    const users = await collection.find({}).toArray(); // 모든 유저 조회
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("❌ 유저 조회 실패:", error);
    return NextResponse.json(
      { message: "서버 오류로 인해 유저를 조회할 수 없습니다." },
      { status: 500 }
    );
  }
}
