import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  status: "active" | "inactive";
  useGroupPermissions: boolean;
  permissionGroup:  mongoose.Types.ObjectId;
  permissions?: {
    [key: string]: string[];
  };
  createdAt: Date;
  lastLogin?: Date;
  lastPasswordChange?: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "/placeholder.svg" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  useGroupPermissions: { type: Boolean, default: true },
  permissionGroup: { type: mongoose.Schema.Types.ObjectId, ref: "PermissionGroup" },
  permissions: { type: Map, of: [String], default: {} },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  lastPasswordChange: { type: Date },
});

// Método para comparar senhas
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash da senha antes de salvar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;