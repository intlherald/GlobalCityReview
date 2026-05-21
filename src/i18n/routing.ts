import { defineRouting } from "next-intl/routing";
import { languagePlan, siteConfig } from "@/lib/config";

export const localeSegments = languagePlan.map((language) => language.language);
export type LocaleSegment = (typeof localeSegments)[number];

export const defaultLocaleSegment = isLocaleSegment(siteConfig.defaultLanguage) ? siteConfig.defaultLanguage : "en";

export function isLocaleSegment(value: string | null | undefined): value is LocaleSegment {
  return Boolean(value && localeSegments.includes(value as LocaleSegment));
}

export function getDirection(localeOrLanguage: string): "ltr" | "rtl" {
  const normalized = localeOrLanguage.toLowerCase();
  return ["ar", "he", "fa", "ur"].some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}-`)) ? "rtl" : "ltr";
}

export function localizedPath(locale: string, path = "/"): string {
  const segment = isLocaleSegment(locale) ? locale : defaultLocaleSegment;
  const cleanPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${segment}${cleanPath}`;
}

export const routing = defineRouting({
  locales: localeSegments,
  defaultLocale: defaultLocaleSegment,
  localePrefix: "always"
});
