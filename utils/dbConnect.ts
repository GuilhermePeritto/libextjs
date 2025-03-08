import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env"
  );
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cache da conexão para evitar múltiplas conexões
let cached: CachedConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose> {
  console.log("Iniciando conexão com o banco de dados...");

  // Se já existe uma conexão, retorne-a
  if (cached.conn) {
    console.log("Usando conexão existente com o banco de dados.");
    return cached.conn;
  }

  // Se não há uma conexão em andamento, crie uma nova
  if (!cached.promise) {
    console.log("Criando nova conexão com o banco de dados...");

    const opts = {
      serverSelectionTimeoutMS: 30000, // 30 segundos de timeout
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("Conexão com o banco de dados estabelecida com sucesso!");
        return mongoose;
      })
      .catch((error) => {
        console.error("Erro ao conectar ao banco de dados:", error);
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    console.error("Erro ao estabelecer conexão com o banco de dados:", error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;