import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    image: String,
    provider: String,
    providerAccountId: String,
  },
  { timestamps: true }
);


UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true, sparse: true });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
