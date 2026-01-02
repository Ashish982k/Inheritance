import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }
  await mongoose.connect(uri);

  // Dev diagnostics and legacy index cleanup
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("Mongo connected:", {
        db: mongoose.connection.name,
        host: mongoose.connection.host,
        state: mongoose.connection.readyState,
      });
    }

    // Drop legacy unique index on googleId if it exists (causes E11000 on null)
    const db = mongoose.connection.db;
    if (db) {
      const users = db.collection("users");
      const indexes = await users.indexes();
      const legacy = indexes.find((i) => i.name === "googleId_1");
      if (legacy) {
        await users.dropIndex("googleId_1");
        if (process.env.NODE_ENV !== "production") {
          console.log("Dropped legacy index: googleId_1");
        }
      }
    }
  } catch (e) {
    console.warn("Mongo init warning:", e?.message || e);
  }
}
