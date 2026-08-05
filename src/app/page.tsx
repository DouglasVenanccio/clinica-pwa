import Link from "next/link";

/**
 * Pagina inicial da Landing Page.
 * Exibe as principais secoes: Hero, Servicos, Depoimentos e Footer.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full bg-creme py-20">
        <div className="container-clinica text-center">
          <h1 className="font-titulo text-4xl font-bold text-marrom md:text-6xl">
            Cuidado que Transforma
          </h1>
          <p className="mt-6 text-lg text-marrom/70">
            Estetica e Fisioterapia para realcar sua beleza e bem-estar.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/agendar" className="btn-primary">Agendar Horario</Link>
            <button className="btn-secondary">Nossos Servicos</button>
          </div>
        </div>
      </section>

      {/* Servicos Section */}
      <section className="w-full bg-white py-16">
        <div className="container-clinica">
          <h2 className="text-center font-titulo text-3xl font-bold text-marrom">
            Nossos Servicos
          </h2>
          <p className="mt-4 text-center text-marrom/70">
            Conheca nossos tratamentos especializados
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card de Servico - Limpeza de Pele */}
            <div className="card-clinica text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dourado/10">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="mt-4 font-titulo text-xl font-semibold text-marrom">
                Limpeza de Pele
              </h3>
              <p className="mt-2 text-sm text-marrom/70">
                Remove impurezas e celulas mortas, promovendo uma pele renovada.
              </p>
              <p className="mt-4 text-dourado font-semibold">60 min - R$ 150,00</p>
            </div>

            {/* Card de Servico - Massagem Relaxante */}
            <div className="card-clinica text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dourado/10">
                <span className="text-2xl">💆</span>
              </div>
              <h3 className="mt-4 font-titulo text-xl font-semibold text-marrom">
                Massagem Relaxante
              </h3>
              <p className="mt-2 text-sm text-marrom/70">
                Alivio de tensões e relaxamento profundo.
              </p>
              <p className="mt-4 text-dourado font-semibold">60 min - R$ 150,00</p>
            </div>

            {/* Card de Servico - Ventosaterapia */}
            <div className="card-clinica text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dourado/10">
                <span className="text-2xl">🍃</span>
              </div>
              <h3 className="mt-4 font-titulo text-xl font-semibold text-marrom">
                Ventosaterapia
              </h3>
              <p className="mt-2 text-sm text-marrom/70">
                Terapia que auxilia na circulacao e eliminacao de toxinas.
              </p>
              <p className="mt-4 text-dourado font-semibold">45 min - R$ 150,00</p>
            </div>

            {/* Card de Servico - Fisioterapia */}
            <div className="card-clinica text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dourado/10">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="mt-4 font-titulo text-xl font-semibold text-marrom">
                Fisioterapia
              </h3>
              <p className="mt-2 text-sm text-marrom/70">
                Tratamentos personalizados para reabilitacao e alivio de dores.
              </p>
              <p className="mt-4 text-dourado font-semibold">50 min - R$ 150,00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos Section */}
      <section className="w-full bg-creme py-16">
        <div className="container-clinica">
          <h2 className="text-center font-titulo text-3xl font-bold text-marrom">
            O que Nossos Clientes Dizem
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Depoimento 1 */}
            <div className="card-clinica">
              <p className="text-marrom/80 italic">
                &quot;Ambiente maravilhoso, profissionais extremamente capacitados.
                Super recomendo!&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dourado/20">
                  <span className="text-sm font-semibold text-dourado">JS</span>
                </div>
                <div>
                  <p className="font-semibold text-marrom">Juliana S.</p>
                  <p className="text-xs text-marrom/60">Cliente desde 2024</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="card-clinica">
              <p className="text-marrom/80 italic">
                &quot;A ventosaterapia me ajudou muito com os problemas de circulacao.
                Resultados excelentes!&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dourado/20">
                  <span className="text-sm font-semibold text-dourado">CM</span>
                </div>
                <div>
                  <p className="font-semibold text-marrom">Carlos M.</p>
                  <p className="text-xs text-marrom/60">Cliente desde 2023</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="card-clinica">
              <p className="text-marrom/80 italic">
                &quot;As massagens sao simplesmente incriveis! Sempre saio renovada e
                relaxada.&quot;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dourado/20">
                  <span className="text-sm font-semibold text-dourado">FA</span>
                </div>
                <div>
                  <p className="font-semibold text-marrom">Fernanda A.</p>
                  <p className="text-xs text-marrom/60">Cliente desde 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-marrom py-12 text-white">
        <div className="container-clinica">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Contato */}
            <div>
              <h4 className="font-titulo text-lg font-semibold text-dourado">
                Contato
              </h4>
              <p className="mt-2 text-sm text-white/80">(21) 99999-9999</p>
              <p className="text-sm text-white/80">contato@belezaebemestar.com.br</p>
              <p className="text-sm text-white/80">Rua das Flores, 123</p>
            </div>

            {/* Horarios */}
            <div>
              <h4 className="font-titulo text-lg font-semibold text-dourado">
                Horario de Funcionamento
              </h4>
              <p className="mt-2 text-sm text-white/80">Seg-Sex: 8h as 20h</p>
              <p className="text-sm text-white/80">Sab: 8h as 16h</p>
              <p className="text-sm text-white/80">Dom: Fechado</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-titulo text-lg font-semibold text-dourado">
                Links Uteis
              </h4>
              <ul className="mt-2 space-y-1">
                <li>
                  <a href="#" className="text-sm text-white/80 hover:text-dourado">
                    Politica de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white/80 hover:text-dourado">
                    Termos de Uso
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-white/20 pt-8 text-center">
            <p className="text-sm text-white/60">
              2025 Beleza &amp; Bem-Estar. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
