import NextAuth, { DefaultSession, DefaultUser, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { getUserByEmail } from "@/app/lib/notion/users";

// Add this type declaration
declare module "next-auth" {
  // eslint-disable-next-line
  interface User extends DefaultUser {
    role?: string;
    customerId?: number;
    email?: string;
    name: string;
    password?: string;
  }
  // eslint-disable-next-line
  interface Session {
    user: {
      role?: string;
      customerId?: number;
      name?: string;
    } & DefaultSession["user"];
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Query Notion database for user
        const user: User | null = await getUserByEmail(credentials.email);

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          customerId: user.customerId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.customerId = user.customerId;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.customerId = token.customerId as number | undefined;
        session.user.name = token.name as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
