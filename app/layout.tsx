import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./slick.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PKBM Flamboyan",
  description: "website resmi pkbm flamboyan comal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className + " bg-slate-50"}>{children}</body>
    </html>
  );
}
