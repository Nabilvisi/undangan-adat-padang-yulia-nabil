import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baralek Gadang — Yulia Alfianeri & Nabil Visi Samawi",
  description:
    "Undangan Pernikahan Adat Minangkabau (Padang) — Yulia Alfianeri & Nabil Visi Samawi. Maimbau Baralek Gadang dengan penuh hormat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Pinyon+Script&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased selection:bg-[#C8A25A]/30 selection:text-inherit">
        {children}
      </body>
    </html>
  );
}
