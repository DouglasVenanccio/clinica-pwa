import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-helpers";

/**
 * GET /api/configuracoes
 * Retorna as configuracoes da clinica.
 */
export async function GET() {
  try {
    const configs = await prisma.configuracao.findMany();
    const map: Record<string, string> = {};
    configs.forEach((c) => { map[c.chave] = c.valor; });

    const defaults: Record<string, string> = {
      nome_clinica: "Beleza & Bem-Estar",
      telefone: "",
      email_contato: "",
      endereco: "",
      horario_abertura: "08:00",
      horario_fechamento: "20:00",
      slot_duration_min: "60",
      antecedencia_cancelamento_h: "24",
      desconto_pix: "5",
      lembrete_whatsapp: "true",
      lembrete_horas_antes: "24",
      logo_url: "",
      favicon_url: "",
      site_title: "Beleza & Bem-Estar",
      cor_primaria: "#B67D35",
      cor_secundaria: "#5C4A3A",
      cor_fundo: "#FDFBF7",
      cor_texto: "#2b2622",
      hero_titulo: "Cuidado que Transforma",
      hero_subtitulo: "Estética e fisioterapia para realçar sua beleza e bem-estar.",
      hero_cta_texto: "Agendar Seu Horário",
      hero_imagem_url: "",
      promo_titulo: "Pacote Bem-Estar Completo",
      promo_preco: "R$ 150,00",
      promo_preco_original: "R$ 300,00",
      promo_descricao: "Um presente de autocuidado, bem-estar e relaxamento.",
      footer_texto: "Estética e fisioterapia para realçar sua beleza e bem-estar.",
      social_instagram: "",
      social_facebook: "",
      social_whatsapp: "",
    };

    return NextResponse.json({
      ...defaults,
      ...map,
    });
  } catch (error) {
    console.error("Erro ao buscar configuracoes:", error);
    return NextResponse.json({ error: "Erro ao buscar configuracoes." }, { status: 500 });
  }
}

/**
 * PUT /api/configuracoes
 * Salva as configuracoes da clinica (upsert).
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const entries = Object.entries(body).filter(([k]) => typeof body[k] === "string" || typeof body[k] === "number" || typeof body[k] === "boolean");

    for (const [chave, valor] of entries) {
      await prisma.configuracao.upsert({
        where: { chave },
        update: { valor: String(valor) },
        create: { chave, valor: String(valor) },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao salvar configuracoes:", error);
    return NextResponse.json({ error: "Erro ao salvar configuracoes." }, { status: 500 });
  }
}
