import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beleza & Bem-Estar | Estetica e Fisioterapia",
  description:
    "Clinica de Estetica e Fisioterapia - Agendamento online, pagamentos e gestao administrativa. Interface premium com design creme e dourado.",
  keywords: [
    "estetica",
    "fisioterapia",
    "agendamento",
    "clinica",
    "beleza",
    "bem-estar",
    "massagem",
    "limpeza de pele",
  ],
  authors: [{ name: "Beleza & Bem-Estar" }],
  openGraph: {
    title: "Beleza & Bem-Estar | Estetica e Fisioterapia",
    description:
      "Clinica de Estetica e Fisioterapia - Agendamento online simplificado",
    type: "website",
    locale: "pt_BR",
    siteName: "Beleza & Bem-Estar",
  },
};

export const viewport: Viewport = {
  themeColor: "#FDFBF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-creme font-corpo antialiased">
        {children}
      </body>
    </html>
  );
}