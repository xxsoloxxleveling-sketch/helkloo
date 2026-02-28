import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aryan's Energy | High-Efficiency Solar",
  description: "Complete Solar Systems. Manufactured in Pakistan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0b0b0b] text-white font-rajdhani selection:bg-white/20">
        <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-overlay bg-noise"></div>
        {children}
      </body>
    </html>
  );
}
