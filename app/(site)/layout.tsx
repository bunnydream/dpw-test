import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RevealObserver from "@/components/RevealObserver";
import { getFooterSettings, getNavSettings } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [nav, footer] = await Promise.all([getNavSettings(), getFooterSettings()]);

  return (
    <>
      <Nav items={nav.items} ctaText={nav.ctaText} ctaLink={nav.ctaLink} logoUrl={nav.logoUrl} logoAlt={nav.logoAlt} />
      {children}
      <Footer
        logoUrl={footer.logoUrl}
        logoAlt={footer.logoAlt}
        ctaLabel={footer.ctaLabel}
        ctaText={footer.ctaText}
        ctaLink={footer.ctaLink}
        tagline={footer.tagline}
        email={footer.email}
        address={footer.address}
        links={footer.links}
      />
      <RevealObserver />
    </>
  );
}
