import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import jwt from "jsonwebtoken";
import User from "./models/user-model";
import connectDB from "./db";

declare module "next-auth" {
  interface User {
    fullname: string;
    role: string;
    image: string;
    _id: string;
    phone: string;
    gender: string;
  }

  interface Session {
    user?: {
      email?: string;
      name?: string;
      image?: string;
      role?: string;
      id: string;
      accessToken?: string;
      gender: string;
      phone: string;
    };
  }

  interface JWT {
    email?: string;
    fullname?: string;
    image?: string;
    role?: string;
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
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

        await connectDB();

        try {
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
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (account?.provider === "credentials" && user) {
        token.email = user.email;
        token.image = user.image;
        token.name = user.fullname;
        token.role = user.role;
        token.id = user._id;
        token.phone = user.phone;
        token.gender = user.gender;
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

        await connectDB();

        const userDB = await User.findOne({ email: data.email });

        if (!userDB) {
          const newUser = new User({
            ...data,
            role: "customer",
          });
          await newUser.save();
          token.email = data.email;
          token.name = newUser.fullname || data.fullname;
          token.role = newUser.role || "customer";
          token.image = newUser.image || data.image;
          token.picture = newUser.image || data.image;
          token.phone = newUser.phone;
          token.gender = newUser.gender;

          token.id = newUser._id;
        } else {
          token.email = data.email;
          token.name = userDB.fullname || data.fullname;
          token.role = userDB.role || "customer";
          token.image = userDB.image || data.image;
          token.picture = userDB.image || data.image;
          token.phone = userDB.phone;
          token.id = userDB._id;
          token.gender = userDB.gender;
        }
      }

      if (trigger === "update" && session) {
        token.picture = session.user?.image;
        token.name = session.user?.name;
        token.image = session.user?.image;
        token.email = session.user?.email;
        token.phone = session.user?.phone;
        token.gender = session.user?.gender;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || "";
        session.user.image = (token.image as string) || "";
        session.user.role = (token.role as string) || "customer";
        session.user.phone = (token.phone as string) || "";
        session.user.gender = (token.gender as string) || "";

        const accsesToken = jwt.sign(token, process.env.NEXTAUTH_SECRET || "", {
          algorithm: "HS256",
        });

        session.user.accessToken = accsesToken;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
};
