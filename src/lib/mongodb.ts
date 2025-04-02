import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
if (!uri) {
  throw new Error('⚠️ MONGODB_URI 환경 변수가 설정되지 않았습니다.');
}

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 타임아웃 시간을 30초로 설정
};

const client = new MongoClient(uri, options);

// 전역 변수를 활용한 클라이언트 연결 유지
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ?? client.connect();

global._mongoClientPromise = clientPromise;

// 데이터베이스 객체를 반환하는 함수
const dbConnect = async (): Promise<Db> => {
  const clientInstance = await clientPromise;
  // 데이터베이스 인스턴스 반환
  return clientInstance.db('mycon');  // 원하는 데이터베이스명을 명시적으로 설정
};

export default dbConnect;
export { clientPromise };
