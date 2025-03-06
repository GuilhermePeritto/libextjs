// src/app/api/ext-page/route.ts
import { generateExtPage } from "@/lib/services/extJsService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const componentDefinition = searchParams.get("componentDefinition");
  const componentUsage = searchParams.get("componentUsage");

  if (!componentUsage) {
    return NextResponse.json(
      { error: "componentUsage é obrigatório" },
      { status: 400 }
    );
  }

  const html = generateExtPage(
    decodeURIComponent(componentDefinition || ""),
    decodeURIComponent(componentUsage)
  );

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}