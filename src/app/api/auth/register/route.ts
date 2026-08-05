import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, senha, password, telefone } = body;
    const senhaFinal = senha || password;

    if (!nome || !email || !senhaFinal) {
      return NextResponse.json(
        { error: "Nome, email e senha sao obrigatorios." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ja cadastrado." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(senhaFinal, 12);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        telefone,
        role: "CLIENTE",
      },
    });

    const cliente = await prisma.cliente.create({
      data: {
        usuarioId: usuario.id,
      },
    });

    return NextResponse.json(
      {
        message: "Cliente registrado com sucesso.",
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role,
        },
        cliente,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao registrar cliente:", error);
    return NextResponse.json(
      { error: "Erro ao registrar cliente." },
      { status: 500 }
    );
  }
}
