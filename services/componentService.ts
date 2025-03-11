import Componente, { IComponente } from "@/models/Component";

// Criar um componente
export const createComponente = async (componenteData: Partial<IComponente>): Promise<IComponente> => {
  const componente = new Componente(componenteData);
  return await componente.save();
};

// Buscar todos os componentes
export const getComponentes = async (): Promise<IComponente[]> => {
  return await Componente.find();
};

// Buscar um componente por ID
export const getComponenteById = async (id: string): Promise<IComponente | null> => {
  return await Componente.findById(id);
};

// Atualizar um componente
export const updateComponente = async (
  id: string,
  componenteData: Partial<IComponente>
): Promise<IComponente | null> => {
  return await Componente.findByIdAndUpdate(id, componenteData, { new: true });
};

// Deletar um componente
export const deleteComponente = async (id: string): Promise<IComponente | null> => {
  return await Componente.findByIdAndDelete(id);
};