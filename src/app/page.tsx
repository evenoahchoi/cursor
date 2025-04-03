"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    signIn("kakao", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-8">
      <div className="text-center max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          MyCon - 나만의 컨설턴트
        </h1>
        <p className="text-gray-600 mb-8">
          효율적인 고객 및 업무 관리를 시작해보세요.
        </p>

        <button
          onClick={handleKakaoLogin}
          className="w-full flex justify-center focus:outline-none rounded-md transform transition-transform duration-150 ease-in-out hover:scale-105 active:scale-95"
        >
          <Image
            src="/kakao_login_large_narrow.png"
            alt="카카오 로그인"
            width={200}
            height={50}
            priority
            className=""
          />
        </button>

      </div>

      <footer className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
        © {new Date().getFullYear()} MyCon. All rights reserved.
      </footer>
    </main>
  );
}
