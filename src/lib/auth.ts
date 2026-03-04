import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

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
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        // ✅ Connect to DB
        await connectToDatabase();

        // ✅ Find user
        const user = await User.findOne({
          username: credentials.username,
        }).select("+password");

        if (!user) {
          throw new Error("Invalid username");
        }

        // ✅ Compare password
        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        // ✅ Return safe user object
        return {
          id: user._id.toString(),
          name: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },

  jwt: {
    maxAge: 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.fullName = user.fullName;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        fullName: token.fullName,
        role: token.role,
      };
      return session;
    },

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