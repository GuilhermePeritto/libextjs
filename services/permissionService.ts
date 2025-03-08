import PermissionGroup, { IPermissionGroup } from "@/models/Permission";

// Buscar todos os grupos de permissões
export const getPermissionGroups = async (): Promise<IPermissionGroup[]> => {
    return await PermissionGroup.find().populate("users", "name email avatar").exec();
  };

// Criar um novo grupo de permissões
export const createPermissionGroup = async (
  groupData: Omit<IPermissionGroup, "_id">
): Promise<IPermissionGroup> => {
  const group = new PermissionGroup(groupData);
  return await group.save();
};

// Atualizar um grupo de permissões
export const updatePermissionGroup = async (
    id: string,
    groupData: Partial<IPermissionGroup>
  ): Promise<IPermissionGroup | null> => {
    return await PermissionGroup.findByIdAndUpdate(
      id,
      { $set: groupData }, // Usamos $set para atualizar apenas os campos fornecidos
      { new: true } // Retorna o documento atualizado
    ).populate("users", "name email avatar");
  };

// Deletar um grupo de permissões
export const deletePermissionGroup = async (id: string): Promise<void> => {
  await PermissionGroup.findByIdAndDelete(id);
};

// Adicionar um usuário a um grupo de permissões
export const addUserToGroup = async (
  groupId: string,
  userId: string
): Promise<IPermissionGroup | null> => {
  return await PermissionGroup.findByIdAndUpdate(
    groupId,
    { $addToSet: { users: userId } },
    { new: true }
  ).populate("users", "name email avatar");
};

// Remover um usuário de um grupo de permissões
export const removeUserFromGroup = async (
  groupId: string,
  userId: string
): Promise<IPermissionGroup | null> => {
  return await PermissionGroup.findByIdAndUpdate(
    groupId,
    { $pull: { users: userId } },
    { new: true }
  ).populate("users", "name email avatar");
};