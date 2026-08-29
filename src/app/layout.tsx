import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const monumentFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-monument",
  weight: ["700"],
});

const satoshiFont = Inter({
  subsets: ["latin"],
  variable: "--font-satoshi",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "KULT ORIGIN | Irreducible Grit",
  description: "Architecturally Engineered Gym Wear. Born in Lahore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${monumentFont.variable} ${satoshiFont.variable} bg-noir text-origin-bone antialiased selection:bg-origin-bone selection:text-noir`}
      >
        {children}
      </body>
    </html>
  );
}