/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getMongoClient } from "@/lib/db";
import connectToDb from "@/lib/db";
import mongoose from "mongoose";

const authOptions = {
  adapter: MongoDBAdapter(getMongoClient()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: any }) {
      await connectToDb();
      const Player = mongoose.models.Player;
      const player = await Player.findOne({ userId: user.id });
      if (!player) {
        await Player.create({
          userId: user.id,
          privateGames: [],
          role: "player",
          authProvider: "nextauth",
          createdAt: new Date(),
        });
      }
      return true;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        await connectToDb();
        const Player = mongoose.models.Player;
        const player = await Player.findOne({ userId: user.id });
        token.role = player?.role || "player";
        token.authProvider = player?.authProvider || "nextauth";
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.authProvider = token.authProvider;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };