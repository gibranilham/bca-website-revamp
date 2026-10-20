import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BCA - Senantiasa di Sisi Anda",
  description: "Solusi perbankan BCA untuk setiap kebutuhan Anda.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
