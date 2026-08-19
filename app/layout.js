import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

export const metadata = {
  title: "ThePinkShelf — Offerte selezionate",
  description: "Le migliori offerte Amazon selezionate a mano, aggiornate ogni giorno dal canale Telegram.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body bg-blush text-ink min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
