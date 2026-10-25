import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VR+ Centro de Estudos",
    template: "%s · VR+ Centro de Estudos",
  },
  description:
    "Apoio ao estudo, explicações e acompanhamento diário do 1º ao 12º ano. Consulta o calendário de sessões e descarrega fichas de apoio.",
};

export const viewport: Viewport = {
  themeColor: "#0f3f4a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={`${geistSans.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
