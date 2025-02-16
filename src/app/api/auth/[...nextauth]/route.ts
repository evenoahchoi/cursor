import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      profile(profile) {
        //카카오에서 유저 데이터 가져오는지 확인하는 코드
        console.log("🟢 카카오 프로필 데이터:", profile);
        return {
          id: String(profile.id),
          name: profile.properties?.nickname || null, // 닉네임이 없을 경우 null 설정
          nickname: profile.properties?.nickname || null, // 닉네임이 없을 경우 null 설정
          email: profile.kakao_account?.email || null, // 이메일이 없을 경우 null 설정
          gender: profile.kakao_account?.gender || null, // 이메일이 없을 경우 null 설정
          birthyear: profile.kakao_account?.birthyear || null, // 이메일이 없을 경우 null 설정
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.gender = token.gender || null; // 성별 추가
        session.user.birthyear = token.birthyear || null; // 출생 연도 추가
      }
      console.log("🔴 세션 데이터:", session); // 디버깅용 로그
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.gender = user.gender; // 성별 저장
        token.birthyear = user.birthyear; // 출생 연도 저장
      }
      console.log("🔵 JWT 토큰:", token); // 디버깅용 로그
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
