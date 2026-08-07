import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/configuracoes
 * Retorna as configuracoes da clinica.
 */
export async function GET() {
  try {
    const configs = await prisma.configuracao.findMany();
    const map: Record<string, string> = {};
    configs.forEach((c) => { map[c.chave] = c.valor; });

    return NextResponse.json({
      nome_clinica: map.nome_clinica || "Beleza & Bem-Estar",
      telefone: map.telefone || "",
      email_contato: map.email_contato || "",
      endereco: map.endereco || "",
      horario_abertura: map.horario_abertura || "08:00",
      horario_fechamento: map.horario_fechamento || "20:00",
      slot_duration_min: Number(map.slot_duration_min || "60"),
      antecedencia_cancelamento_h: Number(map.antecedencia_cancelamento_h || "24"),
      desconto_pix: Number(map.desconto_pix || "5"),
      lembrete_whatsapp: map.lembrete_whatsapp !== "false",
      lembrete_horas_antes: Number(map.lembrete_horas_antes || "24"),
      logo_url: map.logo_url || "",
      favicon_url: map.favicon_url || "",
      site_title: map.site_title || "Beleza & Bem-Estar",
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
