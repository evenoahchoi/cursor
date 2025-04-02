'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

// 사용자 정보 타입을 위한 인터페이스 정의
interface UserProfile {
  name?: string | null;
  email?: string | null;
  gender?: string | null; // 카카오 API 응답에 따라 타입 구체화 가능
  birthyear?: string | null; // 카카오 API 응답에 따라 타입 구체화 가능
}

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // session.user 타입을 UserProfile로 간주 (next-auth 설정에 따라 다를 수 있음)
      saveUserData(session.user as UserProfile);
    }
  }, [status, session]);

  const handleSignIn = () => {
    signIn("kakao");
  };

  // user 파라미터에 UserProfile 타입 적용
  const saveUserData = async (user: UserProfile) => {
    try {
      const response = await fetch('/api/save-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          nickname: user.name, // 닉네임은 이름으로 대체 (필요시 수정)
          gender: user.gender,
          birthyear: user.birthyear,
        }),
      });

      const data = await response.json();
      setMessage(response.ok ? `✅ 사용자 정보 저장 성공! (ID: ${data.userId})` : `⚠️ 오류: ${data.message}`);
    } catch (error) {
      console.error('❌ 저장 요청 실패:', error);
      setMessage('서버 연결 실패. 다시 시도해주세요.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
        <h1 className="text-3xl font-bold text-gray-900">MyCon</h1>
        <p className="text-gray-600 mt-2">효율적인 고객 및 업무 관리를 시작하세요.</p>

        {status === "authenticated" ? (
          <div className="mt-6">
            <p className="text-lg font-semibold">환영합니다, {session?.user?.name || "닉네임 없음"}님!</p>
            <p className="text-gray-600">{session?.user?.email}</p>
            {/* session.user 타입이 불확실하므로 타입 단언 사용 */}
            <p className="text-gray-600">성별: {(session?.user as UserProfile)?.gender === "male" ? "남성" : (session?.user as UserProfile)?.gender === "female" ? "여성" : "알 수 없음"}</p>
            <p className="text-gray-600">출생연도: {(session?.user as UserProfile)?.birthyear || "알 수 없음"}</p>

            <button
              onClick={() => signOut()}
              className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded-full hover:bg-gray-700"
            >
              로그아웃
            </button>
            {message && <p className="mt-4 text-red-500">{message}</p>}
          </div>
        ) : status === "loading" ? (
          <p className="mt-6 text-gray-500">로딩 중...</p>
        ) : (
          <div className="mt-6">
            <button onClick={handleSignIn} className="w-full">
              <Image
                src="/kakao_login_large_narrow.png"
                alt="카카오 로그인"
                width={200}
                height={50}
                className="mx-auto"
                priority
              />
            </button>
          </div>
        )}

        <p className="mt-8 text-xs text-gray-500">© 2025 비구르미. All rights reserved.</p>
      </div>
    </div>
  );
}
