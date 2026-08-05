import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware de protecao de rotas.
 * Verifica autenticacao e redireciona conforme necessario.
 *
 * Rotas protegidas:
 * - /dashboard/* (requer autenticacao)
 * - /admin/* (requer role ADMIN)
 * - /cliente/* (requer role CLIENTE)
 * - /api/* (requer autenticacao, exceto /api/auth)
 */

// Rotas publicas que nao precisam de autenticacao
const publicRoutes = ["/", "/login", "/cadastro", "/servicos", "/api/auth"];

// Rotas que redirecionam se ja estiver logado
const authRoutes = ["/login", "/cadastro"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se a rota e publica
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Verificar se e rota de auth (redirecionar se logado)
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Para rotas publicas, permitir acesso direto
  if (isPublicRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Para rotas de auth, verificar se tem session cookie
  if (isAuthRoute) {
    const hasSession = request.cookies.get("authjs.session-token");
    if (hasSession) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Para rotas protegidas, verificar session cookie
  const hasSession = request.cookies.get("authjs.session-token");

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
