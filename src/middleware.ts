import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de autenticacao de rotas API.
 * Apenas verifica se o usuario esta autenticado (cookie de sessao existe).
 * Verificacao de role (ADMIN) e feita nos proprio handlers de cada rota.
 *
 * Rotas publicas: /api/auth/*, GET /api/servicos, GET /api/profissionais, etc.
 * Todas as outras /api/* exigem autenticacao.
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

  // Para rotas API protegidas, verificar se existe session cookie
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
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
