/**
 * @fileoverview Root Layout
 * @description Tüm uygulamayı saran root layout.
 * SEO metadata, schema.org JSON-LD, font optimization ve tema desteği ile.
 *
 * @architecture
 * - Server Component (Server-Side Rendering)
 * - Schema.org structured data (LocalBusiness, FAQ, WebSite)
 * - Next.js Font Optimization (Google Fonts)
 * - ThemeProvider ile dark/light mode desteği
 * - Admin panel ile site ayarları senkronizasyonu
 */

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DeferredDexterWidget } from "@/components/site/DeferredDexterWidget";
import VercelMonitoring from "@/components/analytics/VercelMonitoring";
import { CoreWebVitalsOptimizer } from "@/lib/core-web-vitals";
import { Providers } from "./providers";
import { getSiteIconHref } from "@/lib/site-branding";
import { canonicalUrl, getSiteUrl } from "@/lib/seo";
import { buildRootSchemaGraphJson } from "@/lib/root-schema";
import { keywordsForPage } from "@/lib/seo-keywords";
import { clampMetaDescription, clampMetaTitle } from "@/lib/meta-clamp";
import { formatGoogleTrustLine } from "@/config/trust-signals";
import { SITE_CONTACT } from "@/config/site-contact";

/** Google Analytics 4 — `NEXT_PUBLIC_GA_MEASUREMENT_ID` ile değiştirilebilir */
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-20PLCYV15H";
const DEXTER_WIDGET_TOKEN =
  process.env.NEXT_PUBLIC_DEXTER_WIDGET_TOKEN ??
  "qA_hhPpFkkr4agR36ikMZOfETZZFzmSB_P86Lz0sLJ2iuLdnCNXbmnRag7ZCgNxMfwirj8isNbTSM8UNNECU9gvL751V6LSqk9a0oIm3VuRyRUuf8aM2CAlitzPD4y-xWLAoPMK2pERuJmsYoEuA8vSu5e7F6z9_uYksMERB13k-QXEIwH6i4NA9dqnPJKHzgSB9XeBFkU2oOi0.3lwqgG1rGtCbM6KWrr3Eoed3dlz3W8AJwCGOZeAPFRE";

const siteRoot = getSiteUrl();

const rootDefaultTitle = clampMetaTitle(
  `${SITE_CONTACT.companyName} | Sarıyer & İstanbul Temizlik`
);
const rootDescription = clampMetaDescription(
  `Sarıyer / Zekeriyaköy ev, ofis, inşaat sonrası temizlik. ${formatGoogleTrustLine()}. Ücretsiz keşif, 7/24 destek. ${SITE_CONTACT.phoneDisplay}.`
);

const rootMetadataBase: Metadata = {
  title: {
    default: rootDefaultTitle,
    template: `%s | ${SITE_CONTACT.companyName}`,
  },
  description: rootDescription,
  keywords: keywordsForPage("root"),
  authors: [{ name: SITE_CONTACT.companyName }],
  creator: SITE_CONTACT.companyName,
  publisher: SITE_CONTACT.companyName,
  metadataBase: new URL(siteRoot),
  alternates: {
    canonical: canonicalUrl("/"),
    languages: {
      "tr-TR": canonicalUrl("/"),
    },
    types: {
      "application/rss+xml": canonicalUrl("/feed.xml"),
      "application/atom+xml": canonicalUrl("/atom.xml"),
      "application/feed+json": canonicalUrl("/feed.json"),
    },
  },
  openGraph: {
    title: rootDefaultTitle,
    description: rootDescription,
    type: "website",
    locale: "tr_TR",
    url: canonicalUrl("/"),
    siteName: SITE_CONTACT.companyName,
    images: [
      {
        url: canonicalUrl("/og-image.jpg"),
        width: 1200,
        height: 630,
        alt: "Zümrüt Vadi Temizlik - Sarıyer Zekeriyaköy Temizlik",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: rootDefaultTitle,
    description: rootDescription,
    images: [canonicalUrl("/og-image.jpg")],
    creator: "@zumrutvaditemizlik",
    site: "@zumrutvaditemizlik",
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
  category: "business",
  classification: "Cleaning Services",
  other: {
    "msapplication-TileColor": "#00A86B",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const iconHref = await getSiteIconHref();
  const googleVerify = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  return {
    ...rootMetadataBase,
    ...(googleVerify ? { verification: { google: googleVerify } } : {}),
    icons: {
      icon: [{ url: iconHref }],
      shortcut: iconHref,
      apple: [{ url: iconHref }],
    },
  };
}

// Viewport metadata (separate export for Next.js 14+)
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#00A86B" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1F44" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "light dark",
};

// ============================================
// TYPES
// ============================================

/** RootLayout component props */
interface RootLayoutProps {
  /** Uygulama içeriği */
  children: React.ReactNode;
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * Root Layout Component
 * Tüm uygulamayı saran ana layout.
 * SEO, fonts, schema.org ve theme desteği ile.
 * 
 * @param children Uygulama içeriği
 */
export default async function RootLayout({ children }: RootLayoutProps) {
  const rootSchemaJsonLd = await buildRootSchemaGraphJson();
  return (
    <html
      lang="tr"
      className="antialiased"
      suppressHydrationWarning
    >
      <head>
        {/* next/script JSON-LD’yi flight payload’a gömebilir — crawlable SSR script kullan */}
        <script
          id="site-root-schema-graph"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: rootSchemaJsonLd }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
        <DeferredDexterWidget token={DEXTER_WIDGET_TOKEN} />
        <Providers gaMeasurementId={GA_MEASUREMENT_ID}>
          {children}
        </Providers>
        <VercelMonitoring />
        <CoreWebVitalsOptimizer />
      </body>
    </html>
  );
}
