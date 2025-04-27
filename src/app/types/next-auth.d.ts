// types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name?: string | null;
      email?: string | null;
      profile_image?: string | null;
      token?: string | null;
      created_at?: string | null;
    };
    accessToken: string | null;
    expired: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: number;
      name?: string | null;
      email?: string | null;
      profile_image?: string | null;
      token?: string | null;
      created_at?: string | null;
    };
    accessToken?: string | null;
    accessTokenExpires?: number;
    expired?: boolean;
  }
}
