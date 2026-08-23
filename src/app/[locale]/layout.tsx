import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { cms } from "@/cms/client";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getDirection, isLocaleSegment } from "@/i18n/routing";
import { siteConfig } from "@/lib/config";
import { CmsHeadScripts } from "@/lib/cms-head-scripts";
import { normalizeLanguages, plannedLanguages } from "@/lib/seo";
import "@/styles/globals.css";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: t("siteTitle"),
    description: t("siteDescription"),
    icons: { icon: "/favicon.ico", shortcut: "/favicon.ico" }
  };
}

async function getShellData(locale: string) {
  const [categories, languages] = await Promise.all([
    cms.categories({ language: locale, page: 1, page_size: 20, sort: "sort_order", order: "asc" }).catch(() => null),
    cms.languages({ enabled: true }).catch(() => [])
  ]);
  const siteProfile = await cms.siteProfile().catch(() => null);
  return {
    categories: categories?.items ?? [],
    languages: languages.length ? normalizeLanguages(languages) : plannedLanguages(),
    siteProfile,
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocaleSegment(locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const { categories, languages, siteProfile } = await getShellData(locale);

  return (
    <html lang={locale} dir={getDirection(locale)}>
      <head>
        <CmsHeadScripts />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          <SiteHeader categories={categories} languages={languages} locale={locale} />
          <main>{children}</main>
          <SiteFooter locale={locale} siteProfile={siteProfile} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
