import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI || "";
const dbName = "eventlog";
const collectionName = "records"; // 새로운 컬렉션 이름

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
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "⚠️ 사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const collection = await connectDB();

    // 샘플 데이터 생성
    const eventTypes = ["결혼식", "장례식", "돌잔치", "졸업식", "환갑잔치"];
    const relationships = ["가족", "친구", "동료", "이웃", "지인"];
    const currentTime = new Date(); // 현재 시간

    const sampleData = [];
    for (let i = 0; i < 10; i++) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const relationship =
        relationships[Math.floor(Math.random() * relationships.length)];
      const eventDate = new Date(
        2025,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      ); // 랜덤 날짜
      const recordDate = new Date(currentTime.getTime() + Math.random() * 3600000); // 현재 시간 기준 최대 1시간 이내
      const amount = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000; // 금액: 10,000 ~ 100,000원
      const recipientName = `상대방 ${i + 1}`;
      const note = `${eventType} - ${relationship}에 대한 경조사비`;
      const type = Math.random() < 0.5 ? "지출" : "수입"; // 지출 또는 수입

      sampleData.push({
        userId,
        type,
        amount,
        eventDate: eventDate.toISOString().split("T")[0], // YYYY-MM-DD 형식
        recordDate: recordDate.toISOString(), // ISO 형식
        recipientName,
        relationship,
        eventType,
        note,
      });
    }

    // 데이터 삽입
    await collection.insertMany(sampleData);

    return NextResponse.json(
      { message: "✅ 샘플 데이터가 성공적으로 저장되었습니다.", data: sampleData },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ 샘플 데이터 저장 실패:", error);
    return NextResponse.json(
      { message: "서버 오류로 인해 샘플 데이터를 저장할 수 없습니다." },
      { status: 500 }
    );
  }
}
