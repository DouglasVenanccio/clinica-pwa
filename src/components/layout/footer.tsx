"use client";

import Link from "next/link";
import { Phone, MapPin, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="bg-marrom text-creme">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-dourado flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">B</span>
              </div>
              <span className="font-display font-semibold tracking-tight">Beleza & Bem-Estar</span>
            </div>
            <p className="text-sm text-creme/70 leading-relaxed mb-5">
              Estetica e fisioterapia para realcar sua beleza e bem-estar.
            </p>
            <div className="space-y-3 text-sm text-creme/80">
              <p className="flex items-center gap-2"><Phone size={15} className="text-dourado" /> (11) 4002-8922</p>
              <p className="flex items-center gap-2"><MapPin size={15} className="text-dourado" /> Av. Paulista, 1500 - Sao Paulo</p>
            </div>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-creme/20 flex items-center justify-center hover:bg-dourado hover:border-dourado transition-colors text-creme">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-creme/20 flex items-center justify-center hover:bg-dourado hover:border-dourado transition-colors text-creme">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-creme/50 mb-5">Horarios</h4>
            <ul className="space-y-3 text-sm text-creme/80">
              <li className="flex justify-between"><span>Seg - Sex</span><span>08h - 20h</span></li>
              <li className="flex justify-between"><span>Sabado</span><span>08h - 18h</span></li>
              <li className="flex justify-between"><span>Domingo</span><span>Fechado</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-creme/50 mb-5">Navegacao</h4>
            <ul className="space-y-3 text-sm text-creme/80">
              <li><Link href="/" className="hover:text-dourado">Inicio</Link></li>
              <li><a href="/#servicos" className="hover:text-dourado">Servicos</a></li>
              <li><a href="/#pacotes" className="hover:text-dourado">Pacotes</a></li>
              <li><a href="/#depoimentos" className="hover:text-dourado">Depoimentos</a></li>
              <li><Link href="/agendar" className="hover:text-dourado">Agendar</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-creme/50 mb-5">Newsletter</h4>
            <p className="text-sm text-creme/70 mb-4">Receba novidades e promocoes.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2.5 bg-creme/5 border border-creme/15 rounded-full text-sm text-creme placeholder:text-creme/40 focus:outline-none focus:border-dourado"
              />
              <button className="w-11 h-11 shrink-0 rounded-full bg-dourado hover:bg-dourado-500 flex items-center justify-center transition-colors">
                <Send size={16} className="text-white" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-creme/10 text-center text-xs text-creme/50">
          &copy; 2025 Beleza & Bem-Estar. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}