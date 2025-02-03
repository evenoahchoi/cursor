import { MongoClient } from "mongodb";

// ✅ globalThis._mongo 타입 선언 추가
declare global {
  var _mongo: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!globalThis._mongo) {
  const client = new MongoClient(uri, options);
  globalThis._mongo = client.connect();
}

// ✅ 'const'로 변경하여 ESLint 경고 해결
const clientPromise = globalThis._mongo;

export default clientPromise;
