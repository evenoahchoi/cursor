'use client';

import React, { useState } from 'react';

export default function SampleUserSavePage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveSampleUsers = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/sample-user-save', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 샘플 유저 저장 성공! (${Object.keys(data.data).length}명)`);
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
      <h1 className="text-2xl font-bold mb-4">샘플 유저 저장</h1>
      
      {/* 저장 버튼 */}
      <button
        onClick={handleSaveSampleUsers}
        disabled={loading}
        className={`py-2 px-4 rounded-full text-white ${
          loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        {loading ? '저장 중...' : '샘플 유저 저장'}
      </button>

      {/* 메시지 출력 */}
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
