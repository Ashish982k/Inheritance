import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";
import { connectDB } from "./database/db.js";
import User from "./database/mongo.js";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google, GitHub, Facebook],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 3,
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        const filter = user.email
          ? { email: user.email }
          : {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            };

        const dbUser = await User.findOneAndUpdate(
          filter as any,
          {
            name: user.name,
            email: user.email || null,
            image: user.image,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          { upsert: true, new: true }
        );

        user.id = dbUser._id.toString(); 
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return true;
      }
    },

    async jwt({ token, user }) {
      if (user?.id) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
});
