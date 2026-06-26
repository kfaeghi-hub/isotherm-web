import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://isothermengineering.com"),
  title: "Isotherm Engineering",
  description:
    "Independent commissioning and engineering services for high-performance buildings across Canada.",
  openGraph: {
    siteName: "Isotherm Engineering",
    locale:   "en_CA",
    type:     "website",
    images:   [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card:   "summary_large_image",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
