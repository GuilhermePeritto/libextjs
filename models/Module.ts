import mongoose, { Document, Schema } from "mongoose";

export interface IModule extends Document {
  name: string;
  label: string;
  actions: string[];
}

const moduleSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  actions: { type: [String], required: true },
});

const Module = mongoose.models.Module || mongoose.model<IModule>("Module", moduleSchema);

export default Module;