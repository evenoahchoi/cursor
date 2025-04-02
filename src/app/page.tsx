"use client";

import React from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const handleKakaoLogin = () => {
    signIn("kakao", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 p-8">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl text-center transform transition duration-300 hover:scale-105">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">MyCon - 나만의 컨설턴트</h1>
        <p className="text-gray-600 mb-8">효율적인 고객 및 업무 관리를 시작해보세요.</p>

        <div
          onClick={handleKakaoLogin}
          className="w-full flex justify-center cursor-pointer"
        >
          <Image
            src="/kakao_login_medium_wide.png"
            alt="카카오 로그인"
            width={222}
            height={49}
            priority
            className="transition duration-300 transform hover:scale-110 hover:opacity-90"
          />
        </div>
      </div>

      <footer className="absolute bottom-4 text-center w-full text-gray-500 text-sm">
        © {new Date().getFullYear()} 비구르미n. All rights reserved.
      </footer>
    </main>
  );
}
