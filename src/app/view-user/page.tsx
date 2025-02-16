'use client';

import React, { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  nickname: string;
  birthyear?: string;
  gender?: string;
}

export default function ViewUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 모든 유저 조회
  const fetchUsers = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/get-users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        setMessage(`⚠️ 오류 발생: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ 유저 조회 실패:', error);
      setMessage('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 특정 유저 삭제
  const deleteUser = async (userId: string) => {
    if (!confirm('정말로 이 유저를 삭제하시겠습니까?')) return;

    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ 유저가 성공적으로 삭제되었습니다.');
        // 삭제된 유저를 화면에서 제거
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        setMessage(`⚠️ 오류 발생: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ 유저 삭제 실패:', error);
      setMessage('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 특정 유저의 샘플 데이터 생성
  const createSampleData = async (userId: string) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/sample-data-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ 샘플 데이터 저장 성공! (${data.data.length}개)`);
      } else {
        setMessage(`⚠️ 오류 발생: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ 샘플 데이터 생성 실패:', error);
      setMessage('서버 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 모든 유저 조회
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">유저 목록</h1>

      {/* 로딩 상태 */}
      {loading && <p>로딩 중...</p>}

      {/* 메시지 출력 */}
      {message && <p className="mb-4 text-lg">{message}</p>}

      {/* 유저 목록 */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4">
        {users.length === 0 ? (
          <p>유저가 없습니다.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">이름</th>
                <th className="border px-4 py-2">이메일</th>
                <th className="border px-4 py-2">닉네임</th>
                <th className="border px-4 py-2">출생연도</th>
                <th className="border px-4 py-2">성별</th>
                <th className="border px-4 py-2">작업</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.nickname}</td>
                  <td className="border px-4 py-2">{user.birthyear || '-'}</td>
                  <td className="border px-4 py-2">{user.gender || '-'}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-500"
                    >
                      삭제
                    </button>

                    {/* 샘플 데이터 생성 버튼 */}
                    <button
                      onClick={() => createSampleData(user._id)}
                      className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-500"
                    >
                      샘플 데이터 생성
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
