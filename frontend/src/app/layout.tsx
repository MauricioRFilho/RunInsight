export const dynamic = 'force-dynamic';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RunInsight - Sua Evolução no Ritmo Certo",
  description: "Análise de carga de treino e gamificação para corredores.",
  manifest: "/manifest.json",
  themeColor: "#020617",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RunInsight",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}