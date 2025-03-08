import Module from "@/models/Module";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Buscar todos os módulos
export async function GET() {
  await dbConnect();

  try {
    const modules = await Module.find();
    return NextResponse.json(modules, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Criar um novo módulo
export async function POST(request: Request) {
  await dbConnect();

  try {
    const moduleData = await request.json();
    const newModule = new Module(moduleData);
    await newModule.save();
    return NextResponse.json(newModule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}