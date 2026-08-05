"use client";

import { logoutAction } from "@/lib/actions/auth";

/**
 * Header do painel admin.
 * Mostra titulo da pagina e actions do usuario.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white px-6">
      {/* Busca */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-64 rounded-lg border border-border bg-creme/50 pl-10 pr-4 text-sm focus:border-dourado focus:outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notificacoes */}
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-creme hover:text-marrom">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-erro text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Usuario */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dourado/20">
            <span className="text-xs font-semibold text-dourado">AD</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-marrom">Admin</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
        </div>

        {/* Logout */}
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg p-2 text-muted-foreground hover:bg-creme hover:text-marrom"
            title="Sair"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </form>
      </div>
    </header>
  );
}
