import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Facebook from "next-auth/providers/facebook";

import { connectDB } from "./database/db.js";
import User from "./database/mongo.js";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Google,
    GitHub,
    Facebook,
  ],
  session: {
    strategy: "jwt",
  
    maxAge: 60 * 60 * 24 * 3,
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        await connectDB();

        // Write/update user document even if email is missing (e.g., GitHub private email)
        const email = user?.email || undefined;
        const provider = account?.provider;
        const providerAccountId = account?.providerAccountId;

        const filter = email
          ? ({
              $or: [
                { email },
                provider && providerAccountId ? { provider, providerAccountId } : { email },
              ],
            } as any)
          : (provider && providerAccountId
              ? { provider, providerAccountId }
              : { email: null }) as any;

        const upserted = await (User as any).findOneAndUpdate(
          filter,
          {
            name: user.name,
            email: email ?? null,
            image: user.image,
            provider,
            providerAccountId,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        if (process.env.NODE_ENV !== "production") {
          console.log("Auth upsert user:", {
            filter,
            _id: upserted?._id?.toString?.(),
            email: upserted?.email,
            provider: upserted?.provider,
            providerAccountId: upserted?.providerAccountId,
          });
        }

        // ✅ ALWAYS allow login
        return true;
      } catch (err) {
        console.error("Sign-in error:", err);
        return true; // IMPORTANT: don't block OAuth
      }
    },
  },
});
