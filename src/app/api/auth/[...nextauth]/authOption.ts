import { LOGIN_URL } from "@/lib/apiEndPoints";
import axiosClient from "@/lib/axios";
import { AuthOptions, Session, ISODateString, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface CustomSession extends Session {
  user?: CustomUser;
  expires: ISODateString;
}

export type CustomUser = {
  id?: string | null;
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
        const customUser = user as CustomUser; // Explicitly type user
        token.user = customUser;
        token.accessToken = customUser.token; // This prevents TypeScript errors
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as CustomUser;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
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
};

export default authOptions;
