import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile(profile: any) {
        return {
          id: String(profile.id),
          name: profile.properties?.nickname || null,
          nickname: profile.properties?.nickname || null,
          email: profile.kakao_account?.email || null,
          gender: profile.kakao_account?.gender || null,
          birthyear: profile.kakao_account?.birthyear || null,
          image: profile.properties?.profile_image || profile.properties?.thumbnail_image || null,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).gender = token.gender || null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).birthyear = token.birthyear || null;
        session.user.image = token.picture || null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.gender = (user as any).gender;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.birthyear = (user as any).birthyear;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.picture = (user as any).image;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
