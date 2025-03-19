import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Account, Session } from "next-auth";

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
        token.expiresAt = Math.floor(Date.now() / 1000) + 3600;
      } else if (token.expiresAt && Date.now() >= Number(token.expiresAt) * 1000 )  {
        console.log("Token expired, logging out user.");
        return {} as JWT;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.idToken) session.idToken = token.idToken as string;
      if (token.accessToken) session.accessToken = token.accessToken as string;
      session.expires = typeof token.expiresAt === 'number' ? new Date(token.expiresAt * 1000).toISOString() : "";
      return session;
    },
  },
};  