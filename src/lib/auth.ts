import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Extend NextAuth types so TypeScript knows our session always has a user + role
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      fullName?: string;
      role: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    fullName?: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    fullName?: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const baseUrl =
          process.env.NEXTAUTH_URL ||
          (typeof window !== "undefined" ? "" : "http://localhost:3000");

        const res = await fetch(`${baseUrl}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.user) throw new Error(data.error || "Login failed");

        // ✅ Return the full user object including role
        return {
          id: data.user._id,
          name: data.user.username,
          email: data.user.email,
          fullName: data.user.fullName,
          role: data.user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minute
  },
  jwt: { maxAge: 60 * 60 },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.fullName = (user as any).fullName;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // ✅ Type-safe: we’ve declared session.user as required above
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.fullName = token.fullName;
      session.user.role = token.role;
      return session;
    },

    // Optional: handle redirects cleanly
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
  },
};
