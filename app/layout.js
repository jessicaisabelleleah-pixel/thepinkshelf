import { Baloo_2, Nunito, Caveat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-accent",
  weight: ["500", "600"],
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
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
        className={`${baloo.variable} ${nunito.variable} ${caveat.variable} font-body bg-blush text-ink min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
