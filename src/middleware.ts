import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de protecao de rotas API.
 * Verifica autenticacao via session cookie.
 *
 * Rotas publicas: /api/auth/*, /api/servicos, /api/profissionais, etc.
 * Rotas protegidas: todas as outras /api/*
 */

const publicApiRoutes = [
  "/api/auth",
  "/api/servicos",
  "/api/profissionais",
  "/api/horarios-disponiveis",
];

export function middleware(request: NextRequest) {
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

  // Para rotas API protegidas, verificar session cookie
  const hasSession =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!hasSession) {
    return NextResponse.json(
      { error: "Autenticacao obrigatoria" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
