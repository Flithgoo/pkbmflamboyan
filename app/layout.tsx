import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./slick.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pkbmflamboyan.sch.id"),
  title: "PKBM Flamboyan",
  description: "website resmi pkbm flamboyan comal",
  openGraph: {
    title: "PKBM Flamboyan",
    description:
      "Website resmi PKBM Flamboyan Comal. Pusat Kegiatan Belajar Masyarakat untuk pendidikan berkualitas.",
    url: "https://pkbmflamboyan.sch.id",
    siteName: "PKBM Flamboyan",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/logo/Logo_PKBM_no-bg.png", // path relatif dari public
        width: 500,
        height: 500,
        alt: "PKBM Flamboyan",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
