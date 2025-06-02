import type { Metadata } from "next";
import { Geist, Geist_Mono, Quicksand } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'

import { Providers } from "@/providers";


const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tienda Ar",
  description: "Tienda de ropa en línea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${quicksand.className} antialiased `}
      >

        <Providers>

          {children}
          <Toaster position="bottom-left" />

        </Providers>
      </body>
    </html>
  );
}
