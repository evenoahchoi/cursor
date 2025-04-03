import NextAuth, { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import dbConnect from "../../../../lib/mongodb";

export const authOptions: NextAuthOptions = {
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
        // MongoDB ObjectId를 세션에 저장
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).id = token.sub;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).mongoId = token.mongoId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).gender = token.gender || null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).birthyear = token.birthyear || null;
        session.user.image = token.picture || null;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // 첫 로그인 시에만 실행
      if (account && user) {
        try {
          const db = await dbConnect();
          const usersCollection = db.collection("users");
          
          // 카카오 ID로 사용자 검색
          const kakaoId = user.id;
          let dbUser = await usersCollection.findOne({ id: kakaoId });
          
          if (dbUser) {
            // 사용자가 이미 존재하면 업데이트
            await usersCollection.updateOne(
              { _id: dbUser._id },
              { 
                $set: { 
                  name: user.name,
                  email: user.email,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  nickname: (user as any).nickname,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  gender: (user as any).gender,
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  birthyear: (user as any).birthyear,
                  updatedAt: new Date()
                } 
              }
            );
            console.log("User updated in MongoDB:", dbUser._id);
          } else {
            // 사용자가 없으면 새로 생성
            const result = await usersCollection.insertOne({
              id: kakaoId,
              name: user.name,
              email: user.email,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              nickname: (user as any).nickname,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              gender: (user as any).gender,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              birthyear: (user as any).birthyear,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            dbUser = { _id: result.insertedId };
            console.log("New user created in MongoDB:", result.insertedId);
          }
          
          // MongoDB ObjectId를 토큰에 저장
          token.mongoId = dbUser._id.toString();
          console.log("MongoDB ObjectId stored in token:", token.mongoId);
        } catch (error) {
          console.error("Error handling user in MongoDB:", error);
        }
        
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
