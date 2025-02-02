// app/page.tsx

import React from 'react';

interface Log {
  _id: string;
  page: string;
  message: string;
  timestamp: string;
  user: string;
  action: string;
}

export default async function Page() {
  // API 엔드포인트 호출 (상대 경로 사용)
  const res = await fetch('/api/mongodb', {
    next: { revalidate: 10 }, // 10초마다 캐시를 갱신 (옵션)
  });

  if (!res.ok) {
    return <div>데이터를 불러오는 데 실패했습니다.</div>;
  }

  const logs: Log[] = await res.json();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>샘플 데이터 목록</h1>
      {logs.length > 0 ? (
        logs.map((log) => (
          <article key={log._id} style={{ marginBottom: '2rem' }}>
            <h2>페이지: {log.page}</h2>
            <p>{log.message}</p>
            <p>사용자: {log.user}</p>
            <p>액션: {log.action}</p>
            <small>
              {new Date(log.timestamp).toLocaleString()}
            </small>
          </article>
        ))
      ) : (
        <p>표시할 데이터가 없습니다.</p>
      )}
    </main>
  );
}
