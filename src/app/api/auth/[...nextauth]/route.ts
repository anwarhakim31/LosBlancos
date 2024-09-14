import connectDB from "@/lib/db";
import User from "@/lib/models/user-model";
import nextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          await connectDB();
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return null;
          }
          console.log({ user: user });
          return user;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.email) {
        if (session.user) {
          session.user.email = token.email;
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
