import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BlurToggle } from "@/components/layout/blur-toggle";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mon Journal 2026",
  description: "Journal Personnel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} dark`}>
        {/* <BlurToggle /> */}
        <Header />
        <Sidebar />
        <main className="ml-16 pt-0">
          {children}
        </main>
      </body>
    </html>
  );
}
