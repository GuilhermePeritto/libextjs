import { createUser, deleteUser, getUsers, updateUser } from "@/services/userService";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Função para tratar requisições GET (buscar todos os usuários)
export async function GET() {
  await dbConnect();

  try {
    const users = await getUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Função para tratar requisições POST (criar um usuário)
export async function POST(request: Request) {
  await dbConnect();

  try {
    const userData = await request.json();
    const user = await createUser(userData);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Função para tratar requisições PUT (atualizar um usuário)
export async function PUT(request: Request) {
  await dbConnect();

  try {
    const { id, ...userData } = await request.json();
    const updatedUser = await updateUser(id, userData);

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Função para tratar requisições DELETE (deletar um usuário)
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const { id } = await request.json();
    const deletedUser = await deleteUser(id);

    if (!deletedUser) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}