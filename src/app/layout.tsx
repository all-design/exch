import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Base metadata - detailed SEO/AEO/GEO meta tags se dinamički učitavaju iz config.json
export const metadata: Metadata = {
  title: "Menjačnica Panter | Najbolji kurs u Beogradu",
  description: "Menjačnica Panter - Najpovoljniji kurs evra, dolara i drugih valuta u Beogradu. Brza i sigurna promena novca.",
  keywords: "menjačnica, kursna lista, promena novca, Beograd, evro, dolar, kurs, menjačnica Beograd",
  authors: [{ name: "Menjačnica Panter" }],
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/logo.svg", color: "#2d9cdb" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Menjačnica Panter | Najbolji kurs u Beogradu",
    description: "Najpovoljniji kurs evra, dolara i drugih valuta u Beogradu.",
    type: "website",
    locale: "sr_RS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Menjačnica Panter | Najbolji kurs u Beogradu",
    description: "Najpovoljniji kurs evra, dolara i drugih valuta u Beogradu.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // GEO meta tags
  other: {
    "geo.region": "RS-BG",
    "geo.placename": "Beograd",
    "format-detection": "telephone=yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#070810" />
        <meta name="msapplication-TileColor" content="#2d9cdb" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* X-UA-Compatible */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Base structured data - will be enhanced by client-side from config.json */}
        <script
          type="application/ld+json"
          id="base-schema"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Menjačnica Panter",
              "url": "https://dev2.cfd/demo/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://dev2.cfd/demo/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
