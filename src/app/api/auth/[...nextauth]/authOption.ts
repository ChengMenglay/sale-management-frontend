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
        };
      }
    
      // Return previous token if not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
    
      // Token is expired
      return {
        ...token,
        expired: true,
        accessToken: null,
      };
    },
    async session({ session, token }) {
      const sessionExpires = new Date(
        token.accessTokenExpires as number
      ).toISOString();
    
      return {
        ...session,
        user: token.user as CustomUser,
        expires: sessionExpires,
        expired: token.expired as boolean | undefined,
        accessToken: token.expired ? null : (token.accessToken as string),
      };
    }
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
};

export default authOptions;
