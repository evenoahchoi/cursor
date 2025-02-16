import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";
const dbName = "eventlog";
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

export async function POST(req: Request) {
  try {
    const { name, email, nickname, gender, birthyear } = await req.json();

    // 필수 입력 항목 확인
    if (!name || !email) {
      return NextResponse.json(
        { message: "⚠️ 이름과 이메일은 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    const collection = await connectDB();

    // 이메일로 기존 사용자 확인
    const existingUser = await collection.findOne({ email });

    if (existingUser) {
      // 기존 사용자 정보 업데이트
      await collection.updateOne(
        { email },
        {
          $set: {
            name,
            nickname,
            gender, // 성별 업데이트
            birthyear, // 생년월일 업데이트
            updatedAt: new Date(),
          },
        }
      );
      return NextResponse.json(
        { message: "✅ 사용자 정보 업데이트 성공", userId: existingUser._id },
        { status: 200 }
      );
    } else {
      // 새 사용자 추가
      const result = await collection.insertOne({
        name,
        email,
        nickname,
        gender, // 성별 추가
        birthyear, // 생년월일 추가
        createdAt: new Date(),
      });
      return NextResponse.json(
        { message: "✅ 새 사용자 등록 성공", userId: result.insertedId },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("❌ 사용자 정보 저장 실패:", error);
    return NextResponse.json(
      { message: "서버 오류로 인해 사용자 정보를 저장할 수 없습니다." },
      { status: 500 }
    );
  }
}
