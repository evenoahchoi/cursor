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

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // 서버에서 실행되는 fetch (SSR)
    const res = await fetch(`${apiUrl}/api/mongodb`, {
      cache: "no-store", // 항상 최신 데이터 가져오기
    });

    if (!res.ok) {
      throw new Error("API 응답 오류");
    }

    logs = await res.json();
  } catch (error) {
    errorMessage = (error as Error).message;
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
    </main>
  );
}
