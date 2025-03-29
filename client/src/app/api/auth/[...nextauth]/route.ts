import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Account, Session } from "next-auth";
import { getSession } from "next-auth/react";

declare module "next-auth" {
  interface Session {
    idToken?: string;
    accessToken?: string;
    expiresAt?: number;
  }
  interface JWT {
    idToken?: string;
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.expiresAt = Math.floor(Date.now() / 1000 + 3600);
      }  else {
        if (typeof token.expiresAt === "number" && token.expiresAt < Math.floor(Date.now() / 1000)) {
          try {
            const refreshedSession = await getSession();
            if (refreshedSession?.idToken) {
              token.idToken = refreshedSession.idToken;
              token.expiresAt = Math.floor(Date.now() / 1000 + 3600);
            }
          } catch (error) {
            console.error("Error refreshing token:", error);
          }
          }
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.idToken) {
        session.idToken = token.idToken as string;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    }
  },
};  

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };