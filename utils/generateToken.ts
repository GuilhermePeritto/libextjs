import { IUser } from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string; // Defina no .env
const JWT_EXPIRES_IN = "1d"; // 1 dia de validade

export const generateToken = (user : IUser): string => {
  return jwt.sign({ user: user }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};