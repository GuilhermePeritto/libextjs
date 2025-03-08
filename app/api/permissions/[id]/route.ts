import PermissionGroup from "@/models/Permission";
import { deletePermissionGroup, updatePermissionGroup } from "@/services/permissionService";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Atualizar um grupo de permissões
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params; // Extrai o ID da URL
        const groupData = await request.json();

        // Verifica se o grupo existe
        const groupExists = await PermissionGroup.findById(id);
        if (!groupExists) {
            return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
        }

        // Atualiza o grupo de permissões
        const updatedGroup = await updatePermissionGroup(id, groupData);

        if (!updatedGroup) {
            return NextResponse.json({ error: "Erro ao atualizar o grupo" }, { status: 500 });
        }

        return NextResponse.json(updatedGroup, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Deletar um grupo de permissões
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params; // Extrai o ID da URL
        await deletePermissionGroup(id);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params; // Extrai o ID da URL
        const group = await PermissionGroup.findById(id);

        if (!group) {
            return NextResponse.json({ error: "Grupo não encontrado" }, { status: 404 });
        }

        return NextResponse.json(group, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}