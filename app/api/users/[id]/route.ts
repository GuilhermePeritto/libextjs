import User from "@/models/User"; // Importe o modelo de usuário
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Buscar um usuário por ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params; // Extrai o ID da URL

        // Busca o usuário no banco de dados
        const user = await User.findById(id);

        // Verifica se o usuário existe
        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Retorna o usuário encontrado
        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        // Trata erros inesperados
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Atualizar um usuário
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params; // Extrai o ID da URL
        const userData = await request.json(); // Extrai os dados do corpo da requisição

        // Verifica se o usuário existe
        const userExists = await User.findById(id);
        if (!userExists) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Atualiza o usuário
        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ error: "Erro ao atualizar o usuário" }, { status: 500 });
        }

        // Retorna o usuário atualizado
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        // Trata erros inesperados
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// Deletar um usuário
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const { id } = params; // Extrai o ID da URL

        // Verifica se o usuário existe
        const userExists = await User.findById(id);
        if (!userExists) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Deleta o usuário
        await User.findByIdAndDelete(id);

        // Retorna sucesso
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        // Trata erros inesperados
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}