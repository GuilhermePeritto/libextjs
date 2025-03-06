import { generateExtPage } from "@/lib/services/extJsService";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { componentDefinition, componentUsage } = await request.json();

    if (!componentUsage) {
      return NextResponse.json(
        { error: "componentUsage é obrigatório" },
        { status: 400 }
      );
    }

    const html = generateExtPage(componentDefinition || "", componentUsage);

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}