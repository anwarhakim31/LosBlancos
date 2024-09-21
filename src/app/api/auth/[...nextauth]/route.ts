import User from "@/lib/models/user-model";
import nextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/db";

declare module "next-auth" {
  interface User {
    fullname: string;
    role: string;
    image: string;
  }

  interface Session {
    user?: {
      email?: string;
      name?: string;
      image?: string;
      role?: string;
    };
  }

  interface JWT {
    email?: string;
    fullname?: string;
    image?: string;
    role?: string;
  }
}

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

        await dbConnect();

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
      if (account?.provider === "credentials" && user) {
        token.email = user.email;
        token.image = user.image;
        token.name = user.fullname;
        token.role = user.role;
      }

      if (account?.provider === "google" && user) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(user.name || "", salt);

        const data = {
          fullname: user.name,
          email: user.email,
          password: hashPassword,
          image: user.image || "",
        };

        await dbConnect();

        try {
          const userDB = await User.findOne({ email: data.email });
          if (!userDB) {
            const newUser = new User({
              ...data,
              role: "member",
            });
            await newUser.save();
          }

          token.email = data.email;
          token.name = data.fullname;
          token.role = userDB?.role || "member";
          token.image = data.image;
        } catch (error) {
          console.log(error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || "";
        session.user.image = (token.image as string) || "";
        session.user.role = (token.role as string) || "member";
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
