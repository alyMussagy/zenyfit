import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZenyFit | Saúde, Beleza e Bem-estar em Moçambique",
  description: "Loja online de produtos selecionados para cuidar da sua pele, corpo e autoestima. Entregamos para todo o país. Pagamento na entrega.",
  keywords: ["ZenyFit", "saúde", "beleza", "bem-estar", "Moçambique", "produtos naturais", "skincare", "cosméticos"],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "ZenyFit | Saúde, Beleza e Bem-estar em Moçambique",
    description: "Produtos selecionados para cuidar da sua pele, corpo e autoestima. Entregamos para todo o país.",
    type: "website",
    locale: "pt_MZ",
    siteName: "ZenyFit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}