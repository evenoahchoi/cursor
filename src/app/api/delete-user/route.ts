import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

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

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "⚠️ 유저 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const collection = await connectDB();
    const result = await collection.deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "✅ 유저가 성공적으로 삭제되었습니다." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "⚠️ 해당 유저를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ 유저 삭제 실패:", error);
    return NextResponse.json(
      { message: "서버 오류로 인해 유저를 삭제할 수 없습니다." },
      { status: 500 }
    );
  }
}
