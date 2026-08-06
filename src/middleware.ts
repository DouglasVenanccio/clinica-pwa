import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de protecao de rotas API.
 * Verifica autenticacao via session cookie e roles.
 *
 * Rotas publicas: /api/auth/*, /api/servicos, /api/profissionais, etc.
 * Rotas ADMIN-only: /api/servicos (PUT/DELETE), /api/profissionais (PUT/DELETE), /api/clientes
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
  "/api/configuracoes",
];

/**
 * Decodifica JWT simple (sem verificacao de assinatura - apenas para leitura de payload).
 * O JWT ja foi verificado pelo Auth.js no lado do servidor.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64URL -> Base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

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
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token");

  if (!sessionCookie) {
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
      const payload = decodeJwtPayload(sessionCookie.value);
      const role = payload?.role as string | undefined;

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
