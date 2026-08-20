import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thepinkshelf.vercel.app";
const title = "ThePinkShelf — Offerte Amazon selezionate ogni giorno";
const description =
  "Uno scaffale digitale di offerte Amazon scelte a mano, aggiornate ogni giorno dal canale Telegram di ThePinkShelf.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — ThePinkShelf",
  },
  description,
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: siteUrl,
    siteName: "ThePinkShelf",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-body bg-blush text-ink min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
