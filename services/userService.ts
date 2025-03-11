import User, { IUser } from "@/models/User";
import { generateToken } from "@/utils/generateToken";
import { jwtDecode } from "jwt-decode";

export const loginUser = async (email: string, password: string): Promise<string | null> => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return generateToken(user._id.toString()); // Gera o token JWT
  }

  return null; // Retorna null se o login falhar
};

// Criar um usuário
export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return await user.save();
};

// Buscar todos os usuários
export const getUsers = async (): Promise<IUser[]> => {
  return await User.find().populate('permissionGroup');
};

// Buscar um usuário por ID
export const getUserById = async (token : string): Promise<IUser | null> => {
  const decodedToken = jwtDecode(token)
  return await User.findById(decodedToken.user).populate('permissionGroup'); 
};

// Atualizar um usuário
export const updateUser = async (
  id: string,
  userData: Partial<IUser>
): Promise<IUser | null> => {
  return await User.findByIdAndUpdate(id, userData, { new: true });
};

// Deletar um usuário
export const deleteUser = async (id: string): Promise<IUser | null> => {
  return await User.findByIdAndDelete(id);
};