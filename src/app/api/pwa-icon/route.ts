import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import prisma from "@/lib/prisma";

/**
 * GET /api/pwa-icon?size=192
 * Retorna o logo da clinica (salvo no banco como base64) redimensionado
 * para o tamanho de icone PWA solicitado (PNG).
 */
export async function GET(request: NextRequest) {
  try {
    const sizeParam = Number(request.nextUrl.searchParams.get("size")) || 192;
    const size = Math.min(Math.max(sizeParam, 64), 1024);

    const configs = await prisma.configuracao.findMany();
    const map: Record<string, string> = {};
    configs.forEach((c) => { map[c.chave] = c.valor; });

    const logoUrl = map.logo_url;
    if (!logoUrl) {
      return NextResponse.json({ error: "Logo nao configurado." }, { status: 404 });
    }

    const base64 = logoUrl.split(",")[1] || logoUrl;
    const buffer = Buffer.from(base64, "base64");

    const png = await sharp(buffer)
      .resize(size, size, { fit: "cover" })
      .png()
      .toBuffer();

    return new NextResponse(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar icone PWA:", error);
    return NextResponse.json({ error: "Erro ao gerar icone PWA." }, { status: 500 });
  }
}
