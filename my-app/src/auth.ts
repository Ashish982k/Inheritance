import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";

import { connectDB } from "./database/db.js";
import User from "./database/mongo.js";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google, GitHub, Facebook
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 3, 
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        const email = user.email || null;
        const provider = account.provider;
        const providerAccountId = account.providerAccountId;

        const filter = email
          ? { $or: [{ email }, { provider, providerAccountId }] }
          : { provider, providerAccountId };

        const upserted = await User.findOneAndUpdate(
          filter as any,
          {
            name: user.name,
            email,
            image: user.image,
            provider,
            providerAccountId,
          },
          { upsert: true, new: true }
        );

        console.log("User saved:", upserted && upserted._id.toString());
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return true; 
      }
    },
  },
});
