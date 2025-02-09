import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      profile(profile) {
        //카카오에서 유저 데이터 가져오는지 확인하는 코드
        //console.log("🟢 카카오 프로필 데이터:", profile);
        return {
          id: String(profile.id),
          name: profile.properties?.nickname || null, // 닉네임이 없을 경우 null 설정
          nickname: profile.properties?.nickname || null, // 닉네임이 없을 경우 null 설정
          email: profile.kakao_account?.email || null, // 이메일이 없을 경우 null 설정
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      //카카오에서 유저 데이터 가져오는지 확인하는 코드
      //console.log("🔴 session 콜백 호출됨 - 초기 세션 데이터:", session);
      
      if (session.user && session.user.email) {
        // 세션 데이터 처리
        return session;
      } else {
        console.error("세션 콜백 에러: user 객체 또는 email 속성이 없습니다.");
        return session; // 또는 에러 처리 로직
      }
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
