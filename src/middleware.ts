import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { SiteLanguage } from "./cms/public";
import { routing } from "./i18n/routing";
import { languagePlan } from "./lib/config";

const intlMiddleware = createMiddleware(routing);

type PublicLanguage = Pick<SiteLanguage, "language" | "is_default" | "enabled" | "sort_order">;

function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const quality = params
        .map((param) => param.trim())
        .find((param) => param.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .filter((item) => item.tag && Number.isFinite(item.quality) && item.quality > 0)
    .sort((a, b) => b.quality - a.quality)
    .map((item) => item.tag);
}

function matchLocale(accepted: string[], languages: PublicLanguage[]) {
  const supported = languages.map((language) => language.language);
  for (const tag of accepted) {
    const base = tag.split("-")[0];
    const exact = supported.find((language) => language.toLowerCase() === tag);
    if (exact) return exact;
    const baseMatch = supported.find((language) => language.toLowerCase() === base);
    if (baseMatch) return baseMatch;
  }
  return null;
}

function plannedLanguages(): PublicLanguage[] {
  return languagePlan.map((language, index) => ({
    language: language.language,
    is_default: language.language === "en",
    enabled: true,
    sort_order: index
  }));
}

function normalizeLanguages(languages: PublicLanguage[]): PublicLanguage[] {
  const byLanguage = new Map(languages.filter((language) => language.enabled !== false).map((language) => [language.language, language]));
  return plannedLanguages().map((fallback) => byLanguage.get(fallback.language) ?? fallback);
}

async function getPublicLanguages(request: NextRequest): Promise<PublicLanguage[]> {
  const apiBase = process.env.CMS_API_BASE ?? "http://127.0.0.1:8000";
  const siteSlug = process.env.SITE_SLUG ?? "global-city-review";
  const url = `${apiBase.replace(/\/+$/, "")}/api/sites/${encodeURIComponent(siteSlug)}/languages?enabled=true`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 180 }
    });
    if (!response.ok) throw new Error(`Language request failed with ${response.status}`);
    const languages = (await response.json()) as PublicLanguage[];
    return normalizeLanguages(languages);
  } catch {
    return plannedLanguages();
  }
}

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const languages = await getPublicLanguages(request);
    const defaultLanguage = languages.find((language) => language.is_default)?.language ?? process.env.DEFAULT_LANGUAGE ?? routing.defaultLocale;
    const matchedLanguage = matchLocale(parseAcceptLanguage(request.headers.get("accept-language")), languages) ?? defaultLanguage;
    const url = request.nextUrl.clone();
    url.pathname = `/${matchedLanguage}`;
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
