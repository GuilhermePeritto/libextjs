// app/api/ext/[id]/route.ts
import { db } from "@/lib/db"; // Exemplo de conexão com o banco de dados
import { generateExtPage } from "@/lib/services/extJsService";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: "ID é obrigatório" },
      { status: 400 }
    );
  }

  try {
    // Recupera o componente do banco de dados
    const componente = await db.componente.findUnique({
      where: { id },
    });

    if (!componente) {
      return NextResponse.json(
        { error: "Componente não encontrado" },
        { status: 404 }
      );
    }

    // Gera o HTML do componente
    const html = generateExtPage(componente.componente, componente.comoUsar);

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