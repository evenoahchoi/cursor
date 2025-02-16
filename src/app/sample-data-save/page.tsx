'use client';

import React, { useState } from 'react';

export default function SampleDataSavePage() {
  const [userId, setUserId] = useState(''); // 유저 ID 상태
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSampleData = async () => {
    if (!userId) {
      setMessage('⚠️ 유저 ID를 입력해주세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sample-data-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId, // 입력된 유저 ID를 전송
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 샘플 데이터 저장 성공! (${data.data.length}개)`);
      } else {
        setMessage(`⚠️ 오류 발생: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ 요청 실패:', error);
      setMessage('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">샘플 데이터 저장</h1>
      
      {/* 유저 ID 입력 필드 */}
      <input
        type="text"
        placeholder="유저 ID를 입력하세요"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg w-80"
      />

      {/* 저장 버튼 */}
      <button
        onClick={handleSaveSampleData}
        disabled={loading}
        className={`py-2 px-4 rounded-full text-white ${
          loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        {loading ? '저장 중...' : '샘플 데이터 저장'}
      </button>

      {/* 메시지 출력 */}
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
