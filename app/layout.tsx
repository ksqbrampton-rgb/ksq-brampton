import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";
import SessionProvider from "@/components/SessionProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Nigerian NIN Enrollment — Brampton`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "NIMC-accredited Nigerian NIN diaspora enrollment center in Brampton, Ontario. Book your appointment online — no account needed.",
  keywords: [
    "NIN",
    "Nigerian National Identification Number",
    "NIMC",
    "Nigeria diaspora",
    "Brampton",
    "Ontario",
    "Canada",
    "NIN enrollment",
    "Knowledge Square",
  ],
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} | Nigerian NIN Enrollment — Brampton`,
    description:
      "NIMC-accredited NIN enrollment for the Nigerian diaspora in Brampton, Ontario.",
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
