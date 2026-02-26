import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kripto Klasik - Cryptography Calculator",
  description:
    "Kalkulator kriptografi klasik: Vigenère, Affine, Playfair, Hill, dan Enigma Cipher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-200 overflow-hidden">
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            {/* Top bar — slim separator for desktop */}
            <header className="sticky top-0 z-20 flex h-14 w-full items-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 lg:hidden">
              <span className="font-bold text-slate-900 dark:text-white">
                Kripto Klasik
              </span>
            </header>
            <main className="flex-1 overflow-y-auto h-full p-4 md:p-8 lg:p-10 relative">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
