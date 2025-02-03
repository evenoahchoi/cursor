import React from "react";

interface Log {
  _id: string;
  page: string;
  message: string;
  timestamp: string;
  user: string;
  action: string;
}

export default async function Page() {
  let logs: Log[] = [];
  let errorMessage = "";
  const logMessages: string[] = []; // API 요청 로그 저장

  try {
    // ✅ 절대 URL 설정 (서버 환경 고려)
    const baseUrl =
      process.env.REAL_URL || // Vercel 배포 환경
      process.env.NEXT_PUBLIC_BASE_URL || // 사용자 지정 환경 변수
      "http://localhost:3000"; // 기본 로컬 개발 환경

    const url = `${baseUrl}/api/mongodb`;
    console.log(`🔗 Fetching from: ${url}`);
    logMessages.push(`Fetching from: ${url}`);

    const res = await fetch(url, {
      cache: "no-store", // 항상 최신 데이터 가져오기
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API 응답 오류 (${res.status}): ${errorText}`);
    }

    logs = await res.json();
    logMessages.push(`✅ API 데이터 로드 완료. 데이터 개수: ${logs.length}`);
  } catch (error) {
    errorMessage = (error as Error).message;
    logMessages.push(`❌ 오류 발생: ${errorMessage}`);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>샘플 데이터 목록</h1>

      {errorMessage ? (
        <div style={{ color: "red" }}>데이터를 불러오는 중 오류 발생: {errorMessage}</div>
      ) : logs.length > 0 ? (
        logs.map((log) => (
          <article key={log._id} style={{ marginBottom: "2rem" }}>
            <h2>페이지: {log.page}</h2>
            <p>{log.message}</p>
            <p>사용자: {log.user}</p>
            <p>액션: {log.action}</p>
            <small>{new Date(log.timestamp).toLocaleString()}</small>
          </article>
        ))
      ) : (
        <p>표시할 데이터가 없습니다.</p>
      )}

      {/* 🛠 API 요청 로그 출력 */}
      <section style={{ marginTop: "2rem", padding: "1rem", background: "#f4f4f4", borderRadius: "5px" }}>
        <h2>📜 API 요청 로그</h2>
        <ul style={{ fontSize: "0.9rem", listStyleType: "none", padding: 0 }}>
          {logMessages.map((log, index) => (
            <li key={index} style={{ marginBottom: "0.5rem" }}>🔹 {log}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
