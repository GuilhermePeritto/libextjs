// models/Componente.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ComponentFile {
  name: string;
  content: string;
}

export interface ComponentFolder {
  name: string;
  children: (ComponentFile | ComponentFolder)[];
}

export interface Componente extends Document {
  nome: string;
  descricao: string;
  comoUsar: string;
  componente: {
    id: string;
    name: string;
    type: "folder" | "file";
    children?: (ComponentFile | ComponentFolder)[];
    extension?: string;
    language?: string;
    content?: string;
  }[];
  autor: string;
  ultimaModificacao: string;
  tamanho?: "pequeno" | "normal" | "largo" | "extralargo";
  pasta?: string;
  propriedades?: { nome: string; tipo: string; descricao: string; padrao?: string }[];
  metodos?: { nome: string; parametros: string; retorno: string; descricao: string }[];
  exemplos?: { titulo: string; codigo: string }[];
}

const ComponenteSchema: Schema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  comoUsar: { type: String, required: true },
  componente: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String, enum: ["folder", "file"], required: true },
      children: { type: Array, default: [] },
      extension: { type: String },
      language: { type: String },
      content: { type: String },
    },
  ],
  autor: { type: String, required: true },
  ultimaModificacao: { type: String, required: true },
  tamanho: { type: String, enum: ["pequeno", "normal", "largo", "extralargo"] },
  pasta: { type: String },
  propriedades: [
    {
      nome: { type: String },
      tipo: { type: String },
      descricao: { type: String },
      padrao: { type: String },
    },
  ],
  metodos: [
    {
      nome: { type: String },
      parametros: { type: String },
      retorno: { type: String },
      descricao: { type: String },
    },
  ],
  exemplos: [
    {
      titulo: { type: String },
      codigo: { type: String },
    },
  ],
});

const Componente = mongoose.models.Componente || mongoose.model<Componente>("Componente", ComponenteSchema);

export default Componente;