import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";
const dbName = "mycon";
const collectionName = "users"; // users 컬렉션 이름

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

export async function POST() {
  try {
    const collection = await connectDB();

    // 샘플 유저 데이터 생성
    const sampleUsers = [];
    const currentTime = new Date(); // 현재 시간
    const genders = ["male", "female"]; // 성별 배열

    for (let i = 1; i <= 100; i++) {
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      const randomBirthYear = Math.floor(Math.random() * (2000 - 1980 + 1)) + 1980; // 1980 ~ 2000 사이 랜덤 출생연도

      sampleUsers.push({
        name: `샘플유저${i}`,
        email: `sampleuser${i}@example.com`,
        nickname: `샘플닉네임${i}`,
        birthyear: String(randomBirthYear),
        gender: randomGender,
        createdAt: currentTime,
        updatedAt: currentTime,
      });
    }

    // 데이터 삽입
    const result = await collection.insertMany(sampleUsers);

    return NextResponse.json(
      { message: "✅ 샘플 유저가 성공적으로 저장되었습니다.", data: result.insertedIds },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ 샘플 유저 저장 실패:", error);
    return NextResponse.json(
      { message: "서버 오류로 인해 샘플 유저를 저장할 수 없습니다." },
      { status: 500 }
    );
  }
}
