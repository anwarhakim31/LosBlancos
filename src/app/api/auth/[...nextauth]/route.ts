import User from "@/lib/models/user-model";
import nextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";

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
        dbConnect();
        try {
          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Error during authentication:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.email = user.email;
      }

      if (account?.provider === "google") {
        console.log(user);
        const data = {
          fullname: user.name,
          email: user.email,
          password: user.name,
        };

        await dbConnect();

        try {
          const userDB = await User.findOne({ email: data.email });
          if (!userDB) {
            const newUser = new User({ ...data, role: "member" });
            await newUser.save();
          }

          token.email = data.email;
          token.fullname = data.fullname;
          token.role = userDB.role || "member";
        } catch (error) {
          console.log(error);
        }
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
    signOut: "/login",
  },
};

const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
