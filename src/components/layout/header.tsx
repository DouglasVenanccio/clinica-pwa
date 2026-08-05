"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre Nos", href: "/#sobre" },
  { label: "Servicos", href: "/#servicos" },
  { label: "Pacotes", href: "/#pacotes" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Contato", href: "/#contato" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-creme/95 backdrop-blur-md shadow-[0_1px_0_rgba(224,220,214,0.8)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-dourado flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">B</span>
            </div>
            <span className="font-display font-semibold text-marrom tracking-tight">
              Beleza <span className="text-dourado">&</span> Bem-Estar
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm text-marrom/80 hover:text-dourado rounded-full transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/agendar"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-dourado hover:bg-dourado-500 text-white text-sm font-medium rounded-full transition-colors"
            >
              AGENDAR AGORA
            </Link>
            <button
              className="lg:hidden p-2 text-marrom"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-6 flex flex-col gap-1 border-t border-border pt-4">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm text-marrom/80 hover:bg-creme-200 rounded-lg"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/agendar"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex justify-center items-center px-5 py-2.5 bg-dourado text-white text-sm font-medium rounded-full"
            >
              AGENDAR AGORA
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}