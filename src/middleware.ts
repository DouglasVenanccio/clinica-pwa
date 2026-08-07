import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware de protecao de rotas API.
 * Verifica autenticacao via session cookie e roles.
 *
 * Rotas publicas: /api/auth/*, /api/servicos (GET), /api/profissionais (GET), etc.
 * Rotas ADMIN-only: /api/servicos (PUT/DELETE), /api/profissionais (PUT/DELETE), /api/clientes, /api/usuarios
 * Rotas protegidas: todas as outras /api/*
 */

const publicApiRoutes = [
  "/api/auth",
  "/api/servicos",
  "/api/profissionais",
  "/api/horarios-disponiveis",
];

// Rotas que exigem role ADMIN para escrita (PUT/DELETE/POST)
const adminOnlyRoutes = [
  "/api/servicos",
  "/api/profissionais",
  "/api/clientes",
  "/api/promocoes",
  "/api/usuarios",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // So aplica middleware em rotas /api/
  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Verificar se a rota API e publica
  const isPublicApi = publicApiRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isPublicApi) {
    return NextResponse.next();
  }

  // Para rotas API protegidas, verificar session via getToken (suporta JWE do Auth.js v5)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json(
      { error: "Autenticacao obrigatoria" },
      { status: 401 }
    );
  }

  // Verificar role para rotas admin-only (apenas para metodos de escrita)
  const method = request.method;
  const isWriteMethod = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

  if (isWriteMethod) {
    const isAdminRoute = adminOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isAdminRoute) {
      const role = token.role as string | undefined;

      if (role !== "ADMIN") {
        return NextResponse.json(
          { error: "Acesso restrito a administradores" },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
