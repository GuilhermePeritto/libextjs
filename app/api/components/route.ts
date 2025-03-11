// app/api/componentes/route.ts
import { createComponente, getComponentes } from "@/services/componentService";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Função para lidar com requisições GET
export async function GET() {
  await dbConnect();

  try {
    const componentes = await getComponentes();
    return NextResponse.json(componentes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Função para lidar com requisições POST
export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const componente = await createComponente(body);
    return NextResponse.json(componente, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}