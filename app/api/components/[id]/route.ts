// app/api/componentes/[id]/route.ts
import { deleteComponente, updateComponente } from "@/services/componentService";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
// Função para lidar com requisições PUT
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const body = await request.json();
    const updatedComponente = await updateComponente(params.id, body);

    if (!updatedComponente) {
      return NextResponse.json({ error: "Componente não encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedComponente, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Função para lidar com requisições DELETE
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const deletedComponente = await deleteComponente(params.id);

    if (!deletedComponente) {
      return NextResponse.json({ error: "Componente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}