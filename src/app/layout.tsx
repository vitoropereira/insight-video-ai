import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insight Videos",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
