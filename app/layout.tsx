import type { Metadata } from "next";
import { getSeoSettings } from "@/lib/site-settings";
import { SITE_URL } from "@/lib/seo";
import "../shared.css";
import { Analytics } from "@vercel/analytics/next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    title: "Digital Public Works: Building digital infrastructure that strengthens communities.",
    metadataBase: new URL(SITE_URL),
    icons: seo.faviconUrl ? { icon: seo.faviconUrl } : undefined,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;700&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
