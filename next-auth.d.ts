import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: string | null | undefined; // string 또는 null 또는 undefined 허용
      email: string | null | undefined; // string 또는 null 또는 undefined 허용
      nickname: string | null | undefined; // string 또는 null 또는 undefined 허용
    } & DefaultSession["user"];
  }

  interface User {
    name?: string; // User 객체에도 nickname 추가 (선택적 속성)
    email?: string; // User 객체에도 nickname 추가 (선택적 속성)
    nickname?: string; // User 객체에도 nickname 추가 (선택적 속성)
  }
}
