import mongoose, { Document, Schema } from "mongoose";

export interface IPermissionGroup extends Document {
  name: string;
  description: string;
  permissions: {
    [key: string]: string[];
  };
  users: mongoose.Types.ObjectId[];
}

const permissionGroupSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  permissions: { type: Map, of: [String], default: {} }, // Permissões como um mapa
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Referência aos usuários
});

const PermissionGroup =
  mongoose.models.PermissionGroup ||
  mongoose.model<IPermissionGroup>("PermissionGroup", permissionGroupSchema);

export default PermissionGroup;