import { LOGIN_URL } from "@/lib/apiEndPoints";
import axiosClient from "@/lib/axios";
import { AuthOptions, Session, ISODateString, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface CustomSession extends Session {
  user: CustomUser; // ← remove the optional ?
  expires: ISODateString;
  expired: boolean;
  accessToken: string | null;
}

export type CustomUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  profile_image?: string | null;
  token?: string | null; // Ensure your API actually returns this
  created_at?: string | null;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as unknown as CustomUser;
        return {
          ...token,
          user: customUser,
          accessToken: customUser.token,
          accessTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000,
          expired: false,
        };
      }

      // Check if token is expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        // Token is still valid
        return token;
      }

      // Token has expired
      return {
        ...token,
        expired: true,
        accessToken: null,
      };
    },
    async session({ session, token }) {
      // If no token, return empty session
      if (!token) {
        return {
          ...session,
          user: {} as CustomUser,
          expires: session.expires,
          expired: true,
          accessToken: null,
        } as CustomSession;
      }

      const sessionExpires = new Date(
        token.accessTokenExpires as number
      ).toISOString();

      return {
        ...session,
        user: token.user as CustomUser,
        expires: sessionExpires,
        expired: (token.expired as boolean) || false,
        accessToken: token.expired
          ? null
          : (token.accessToken as string | null),
      } as CustomSession;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const res = await axiosClient.post(LOGIN_URL, credentials);
          const user = res.data?.user;
          return user ? (user as User) : null; // ✅ Explicitly cast to User
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Explicitly set strategy
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  secret: process.env.NEXTAUTH_SECRET, // Make sure this is set
};

export default authOptions;
