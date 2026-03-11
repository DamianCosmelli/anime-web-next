import type { Metadata } from "next";
import "./globals.css";
import { Layout } from "@/components/Layout/MainLayout";

export const metadata: Metadata = {
  title: "Anime-Web",
  description: "Web para ver anime en emisión, temporadas, búsqueda y top anime",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
