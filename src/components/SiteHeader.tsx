import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Category, SiteLanguage } from "@/cms/public";
import { siteConfig } from "@/lib/config";
import { localizedPath } from "@/i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchBox } from "./SearchBox";

export function SiteHeader({ categories, languages, locale }: { categories: Category[]; languages: SiteLanguage[]; locale: string }) {
  const tHeader = useTranslations("header");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("common.categories");
  return (
    <header className="site-header">
      <div className="top-strip">
        <span>{tHeader("positioning")}</span>
        <LanguageSwitcher languages={languages} currentLocale={locale} ariaLabel={tHeader("languageNav")} fallbackLabel={tCommon("fallbackLanguage")} />
      </div>
      <div className="masthead">
        <Link className="brand" href={localizedPath(locale)} aria-label={siteConfig.englishName}>
          <span className="brand-title">
            <img src="/site-icon.ico" alt="" aria-hidden="true" />
            {tCommon("brand")}
          </span>
          <strong>{tCommon("brandLocal")}</strong>
        </Link>
        <SearchBox compact locale={locale} />
      </div>
      <nav className="nav-row" aria-label={tHeader("mainNav")}>
        {categories.map((category) => (
          <Link href={localizedPath(locale, `/categories/${category.slug}`)} key={category.id}>
            {category.language === locale && category.name ? category.name : tCategories(category.slug)}
          </Link>
        ))}
        <Link href={localizedPath(locale, "/editors")}>{tHeader("editors")}</Link>
        <Link href={localizedPath(locale, "/about")}>{tHeader("about")}</Link>
      </nav>
    </header>
  );
}
