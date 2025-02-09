'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      saveUserData(session.user);
    }
  }, [status, session]);

  const handleSignIn = () => {
    signIn("kakao");
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const saveUserData = async (user: any) => {
    try {
      const response = await fetch('/api/save-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          nickname: user.name, // 카카오 로그인에서는 nickname 대신 name을 사용
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ 사용자 정보 저장 성공! (ID: ${data.userId})`);
      } else {
        setMessage(`⚠️ 오류: ${data.message}`);
      }
    } catch (error) {
      console.error('❌ 저장 요청 실패:', error);
      setMessage('서버 연결 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {status === "authenticated" ? (
          <div>
            <p className="text-xl font-semibold mb-2">환영합니다, {session?.user?.name || "닉네임 없음"}님!</p>
            <p className="text-gray-600 mb-4">{session?.user?.email}</p>
            <button
              onClick={() => signOut()}
              className="bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700"
            >
              로그아웃
            </button>
            {message && <p className="mt-4 text-xl">{message}</p>}
          </div>
        ) : status === "loading" ? (
          <div>Loading...</div>
        ) : (
          <div>
            <p className="text-xl font-semibold mb-4">카카오로 로그인</p>
            <img
              src="/kakao_login_medium_narrow.png"
              alt="카카오 로그인"
              className="w-auto h-auto max-w-full cursor-pointer"
              onClick={handleSignIn}
            />
          </div>
        )}
      </div>
    </div>
  );
}
