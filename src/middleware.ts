import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware simplificado.
 * Autenticacao e verificada nos handlers de rota via auth() do Auth.js.
 * Este middleware so redireciona paginas HTML (nao API).
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|assets).*)"],
};
