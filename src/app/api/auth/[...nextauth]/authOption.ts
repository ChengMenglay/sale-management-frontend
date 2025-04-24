import { LOGIN_URL } from "@/lib/apiEndPoints";
import axiosClient from "@/lib/axios";
import { AuthOptions, Session, ISODateString, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface CustomSession extends Session {
  user?: CustomUser;
  expires: ISODateString;
  expired: boolean;
  accessToken: string | null;
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
        token.accessTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000;
      }

      // Check if token is expired
      if (
        token.accessTokenExpires &&
        Date.now() > (token.accessTokenExpires as number)
      ) {
        console.log("Token expired");
        return {
          ...token,
          expired: true, // Add expired flag
          accessToken: null, // Clear the token
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token.user as CustomUser,
        expired: token.expired as boolean | undefined,
        accessToken: token.expired ? null : token.accessToken,
      };
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
