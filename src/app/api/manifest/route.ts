import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/manifest
 * Manifest PWA dinamico, construido a partir das configuracoes salvas
 * no banco (nome, cores e logo da clinica).
 */
export async function GET() {
  try {
    const configs = await prisma.configuracao.findMany();
    const map: Record<string, string> = {};
    configs.forEach((c) => { map[c.chave] = c.valor; });

    const nome = map.nome_clinica || map.site_title || "Clinica Calii";
    const corPrimaria = map.cor_primaria || "#B67D35";
    const corFundo = map.cor_fundo || "#FDFBF7";
    const temLogo = Boolean(map.logo_url);

    const manifest = {
      name: nome,
      short_name: nome,
      description: "Agendamento de serviços de estética e fisioterapia.",
      start_url: "/",
      scope: "/",
      display: "standalone",
      background_color: corFundo,
      theme_color: corPrimaria,
      orientation: "portrait-primary",
      categories: ["health", "lifestyle", "medical"],
      lang: "pt-BR",
      icons: [
        {
          src: temLogo ? "/api/pwa-icon?size=192" : "/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: temLogo ? "/api/pwa-icon?size=512" : "/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    };

    return new NextResponse(JSON.stringify(manifest), {
      headers: {
        "Content-Type": "application/manifest+json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar manifest:", error);
    return new NextResponse(JSON.stringify({ error: "Erro ao gerar manifest." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
