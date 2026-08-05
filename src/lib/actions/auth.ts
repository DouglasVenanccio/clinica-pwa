"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { cadastroSchema } from "@/lib/validations";

/**
 * Server Action: Login do usuario.
 * Valida credenciais e redireciona conforme o role.
 */
export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get("email") as string;
  const senha = formData.get("senha") as string;

  if (!email || !senha) {
    return { error: "Email e senha sao obrigatorios." };
  }

  try {
    await signIn("credentials", {
      email,
      senha,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou senha invalidos." };
        default:
          return { error: "Erro ao fazer login. Tente novamente." };
      }
    }
    throw error;
  }

  return null;
}

/**
 * Server Action: Cadastro de novo cliente.
 * Valida dados, cria usuario e cliente, e faz login automatico.
 */
export async function registerAction(
  _prevState: { error: string; success: boolean } | null,
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const data = {
    nome: formData.get("nome") as string,
    email: formData.get("email") as string,
    telefone: formData.get("telefone") as string,
    senha: formData.get("senha") as string,
    confirmarSenha: formData.get("confirmarSenha") as string,
  };

  // Validar com Zod
  const result = cadastroSchema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return { error: firstError.message, success: false };
  }

  try {
    // Verificar se email ja existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "Este email ja esta cadastrado.", success: false };
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(data.senha, 12);

    // Criar usuario + cliente em transacao
    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          email: data.email,
          senha: senhaHash,
          nome: data.nome,
          telefone: data.telefone,
          role: "CLIENTE",
        },
      });

      await tx.cliente.create({
        data: {
          usuarioId: usuario.id,
        },
      });
    });

    // Login automatico apos cadastro
    await signIn("credentials", {
      email: data.email,
      senha: data.senha,
      redirectTo: "/dashboard",
    });

    return { error: "", success: true };
  } catch (error) {
    console.error("Erro no cadastro:", error);
    return { error: "Erro ao criar conta. Tente novamente.", success: false };
  }
}

/**
 * Server Action: Logout.
 */
export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
