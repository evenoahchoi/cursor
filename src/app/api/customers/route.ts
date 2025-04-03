// src/app/api/customers/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // authOptions 경로 확인!
import dbConnect from "../../../lib/mongodb"; // clientPromise 대신 dbConnect 사용
import { Db, ObjectId } from 'mongodb';

// Customer 인터페이스 제거 (사용하지 않음)

export async function POST(request: Request) {
  console.log("===== [API] POST /api/customers Start =====");
  try {
    const session = await getServerSession(authOptions);
    console.log("[API] Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.mongoId) {
      console.error("[API] Error: Unauthorized - Session or MongoDB User ID missing.");
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // MongoDB ObjectId로 변환
    const userMongoId = session.user.mongoId;
    console.log("[API] User MongoDB ID:", userMongoId);
    
    let userObjectId: ObjectId;
    try {
      userObjectId = new ObjectId(userMongoId);
    } catch (e) {
      console.error("[API] Error: Invalid MongoDB ObjectId format:", e);
      return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
    }

    const customerData = await request.json();
    console.log("[API] Received data:", customerData);
    const { name, email, phone } = customerData;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      console.error("[API] Error: Invalid customer name.");
      return NextResponse.json({ message: 'Invalid customer name' }, { status: 400 });
    }

    console.log("[API] Connecting to MongoDB...");
    const db = await dbConnect(); // dbConnect 함수 사용
    
    // customers 컬렉션이 없으면 생성
    const collections = await db.listCollections({ name: "customers" }).toArray();
    if (collections.length === 0) {
      console.log("[API] Creating customers collection...");
      await db.createCollection("customers");
    }
    
    const customersCollection = db.collection("customers");
    console.log("[API] Connected to DB 'mycon', collection 'customers'");

    const newCustomer = {
      userId: userObjectId, // MongoDB ObjectId 저장
      name: name.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      lastBookingDate: null,
      totalSpent: 0,
      segment: '신규' as const,
      createdAt: new Date(),
    };
    console.log("[API] Prepared new customer document:", newCustomer);

    console.log("[API] Inserting document...");
    const result = await customersCollection.insertOne(newCustomer);
    console.log("[API] MongoDB insert result:", result);

    if (!result.insertedId) {
        console.error("[API] Error: MongoDB insertion failed - no insertedId.");
        throw new Error("Failed to insert customer into database.");
    }

    const insertedCustomer = { ...newCustomer, _id: result.insertedId };
    console.log("[API] Customer created successfully:", insertedCustomer);
    console.log("===== [API] POST /api/customers End =====");

    // _id와 userId를 문자열로 변환하여 반환
    return NextResponse.json({
        ...insertedCustomer,
        _id: result.insertedId.toString(),
        userId: userObjectId.toString() // ObjectId를 문자열로 변환
      }, { status: 201 });

  } catch (error) {
    console.error('[API] Failed to create customer:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.log("===== [API] POST /api/customers Error End =====");
    return NextResponse.json({ message: `Failed to create customer: ${message}` }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: Request) { // 미사용 매개변수 처리
    console.log("===== [API] GET /api/customers Start =====");
    try {
        const session = await getServerSession(authOptions);
        console.log("[API] GET Session:", JSON.stringify(session, null, 2));

        if (!session?.user?.mongoId) {
          console.error("[API] GET Error: Unauthorized - Session or MongoDB User ID missing.");
          return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // MongoDB ObjectId로 변환
        const userMongoId = session.user.mongoId;
        console.log("[API] GET User MongoDB ID:", userMongoId);
        
        let userObjectId: ObjectId;
        try {
          userObjectId = new ObjectId(userMongoId);
        } catch (e) {
          console.error("[API] GET Error: Invalid MongoDB ObjectId format:", e);
          return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
        }

        console.log("[API] GET Connecting to MongoDB...");
        const db = await dbConnect(); // dbConnect 함수 사용
        
        // customers 컬렉션이 없으면 생성
        const collections = await db.listCollections({ name: "customers" }).toArray();
        if (collections.length === 0) {
          console.log("[API] Creating customers collection...");
          await db.createCollection("customers");
          
          // 더미 데이터 생성 (컬렉션이 없을 때만)
          await createDummyData(db, userObjectId);
        }
        
        const customersCollection = db.collection("customers");
        console.log("[API] GET Connected to DB 'mycon', collection 'customers'");

        console.log("[API] GET Fetching customers for user:", userObjectId);
        // ObjectId로 쿼리
        const userCustomers = await customersCollection.find({ userId: userObjectId }).sort({ createdAt: -1 }).toArray();
        console.log("[API] GET Fetched customers count:", userCustomers.length);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const customersForJson = userCustomers.map((customer: any) => ({
            ...customer,
            _id: customer._id.toString(),
            userId: customer.userId.toString(), // ObjectId를 문자열로 변환
            lastBookingDate: customer.lastBookingDate?.toISOString() || null,
            createdAt: customer.createdAt?.toISOString(),
        }));

        console.log("[API] GET Returning customers:", customersForJson.length);
        console.log("===== [API] GET /api/customers End =====");
        return NextResponse.json(customersForJson, { status: 200 });

    } catch (error) {
        console.error('[API] GET Failed to fetch customers:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        console.log("===== [API] GET /api/customers Error End =====");
        return NextResponse.json({ message: `Failed to fetch customers: ${message}` }, { status: 500 });
    }
}

// 더미 데이터 생성 함수
async function createDummyData(db: Db, userObjectId: ObjectId) {
  try {
    console.log("[API] Creating dummy customer data...");
    const customersCollection = db.collection("customers");
    
    // 더미 고객 데이터
    const dummyCustomers = [
      {
        userId: userObjectId, // MongoDB ObjectId 사용
        name: "김지영",
        email: "jiyoung.kim@example.com",
        phone: "010-1234-5678",
        lastBookingDate: new Date(2023, 10, 15),
        totalSpent: 250000,
        segment: "단골",
        createdAt: new Date(2023, 8, 10)
      },
      {
        userId: userObjectId, // MongoDB ObjectId 사용
        name: "이민수",
        email: "minsu.lee@example.com",
        phone: "010-2345-6789",
        lastBookingDate: new Date(2023, 11, 3),
        totalSpent: 450000,
        segment: "VIP",
        createdAt: new Date(2023, 7, 22)
      },
      {
        userId: userObjectId, // MongoDB ObjectId 사용
        name: "박서연",
        email: "seoyeon.park@example.com",
        phone: "010-3456-7890",
        lastBookingDate: null,
        totalSpent: 50000,
        segment: "신규",
        createdAt: new Date(2023, 11, 28)
      },
      {
        userId: userObjectId, // MongoDB ObjectId 사용
        name: "최준호",
        email: "junho.choi@example.com",
        phone: "010-4567-8901",
        lastBookingDate: new Date(2023, 9, 25),
        totalSpent: 150000,
        segment: "일반",
        createdAt: new Date(2023, 9, 1)
      },
      {
        userId: userObjectId, // MongoDB ObjectId 사용
        name: "정다연",
        email: "dayeon.jung@example.com",
        phone: "010-5678-9012",
        lastBookingDate: new Date(2023, 11, 20),
        totalSpent: 350000,
        segment: "단골",
        createdAt: new Date(2023, 8, 15)
      }
    ];
    
    // 더미 데이터 삽입
    const result = await customersCollection.insertMany(dummyCustomers);
    console.log(`[API] Inserted ${result.insertedCount} dummy customers`);
  } catch (error) {
    console.error("[API] Error creating dummy data:", error);
  }
}