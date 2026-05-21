import { useTranslations } from "next-intl";
import { localizedPath } from "@/i18n/routing";

export function SearchBox({ defaultValue = "", compact = false, locale }: { defaultValue?: string; compact?: boolean; locale: string }) {
  const t = useTranslations("search");
  return (
    <form className={compact ? "search-box compact" : "search-box"} action={localizedPath(locale, "/search")}>
      <input name="q" type="search" defaultValue={defaultValue} placeholder={t("placeholder")} aria-label={t("ariaLabel")} />
      <button type="submit">{t("button")}</button>
    </form>
  );
}
