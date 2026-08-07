import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    });
    return NextResponse.json({ categorias });
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return NextResponse.json({ error: "Erro ao buscar categorias." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const categoria = await prisma.categoria.create({
      data: {
        nome: body.nome,
        descricao: body.descricao || "",
        icone: body.icone || null,
        ativo: true,
      },
    });
    return NextResponse.json({ categoria }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json({ error: "Erro ao criar categoria." }, { status: 500 });
  }
}