/**
 * Public CMS SDK
 *
 * Zero-dependency TypeScript client for external SSR sites.
 *
 * Language behavior:
 * - Category and editor APIs prefer the requested language, then fall back to the site's default language.
 * - Article APIs are strict by language. If an article has no translation in the requested language,
 *   it is not returned.
 */

/** Sort direction for list APIs. */
export type SortOrder = "asc" | "desc";

/** Standard paginated response returned by list APIs. */
export type PublicPage<T> = {
  /** Current page records. */
  items: T[];
  /** Current page number, starting from 1. */
  page: number;
  /** Records per page. */
  page_size: number;
  /** Total records matching the query. */
  total: number;
  /** Total page count. Returns 0 when total is 0. */
  total_pages: number;
};

/** Site language configuration, used for frontend language switchers. */
export type PublicSiteProfile = {
  id: number;
  slug: string;
  domain: string;
  name: string;
  default_language: string;
  supported_languages: string[];
  contact_email: string | null;
  address: string | null;
  theme_config: Record<string, unknown>;
};

export type SiteLanguage = {
  /** Language config ID. */
  id: number;
  /** Site ID. */
  site_id: number;
  /** Language code, for example zh or en. */
  language: string;
  /** Display name configured in admin. */
  display_name: string;
  /** Native language name, for example 简体中文 or English. */
  native_name: string | null;
  /** Sort order for language switchers. */
  sort_order: number;
  /** Whether this language is the site's default language. */
  is_default: boolean;
  /** Whether this language is enabled for public use. */
  enabled: boolean;
};

/** Category/channel data for navigation and channel pages. */
export type Category = {
  /** Category ID. */
  id: number;
  /** Site ID. */
  site_id: number;
  /** Parent category ID. Null means this is a top-level category. */
  parent_id: number | null;
  /** Stable category slug used in URLs and category_slug filters. */
  slug: string;
  /** Sort order for navigation. */
  sort_order: number;
  /** Fixed category image URL, if configured. */
  hero_image: string | null;
  /** Whether this category is enabled. */
  enabled: boolean;
  /**
   * Actual content language returned.
   * May differ from requested language when category translation falls back to site default language.
   */
  language: string | null;
  /** Category display name. */
  name: string | null;
  /** Category description. */
  description: string | null;
  /** SEO title for category page. */
  seo_title: string | null;
  /** SEO description for category page. */
  seo_description: string | null;
};

/** Source/reference link attached to an article translation. */
export type ArticleSource = {
  /** Source ID. */
  id: number;
  /** Article ID. */
  article_id: number;
  /** Article translation ID. */
  translation_id: number;
  /** Site ID. */
  site_id: number;
  /** Source language. */
  language: string;
  /** Original source URL. Display this at the bottom of article pages. */
  source_url: string;
  /** Source title, if known. */
  source_title: string | null;
  /** Source domain, if parsed. */
  source_domain: string | null;
  /** Whether this is the primary source. */
  is_primary: boolean;
};

/** Language-specific article content. */
export type ArticleTranslation = {
  /** Translation ID. */
  id: number;
  /** Article ID. */
  article_id: number;
  /** Site ID. */
  site_id: number;
  /** Translation language. */
  language: string;
  /** Article title. */
  title: string;
  /** Article URL slug for detail pages. */
  slug: string;
  /** Short description, suitable for lists and meta description. */
  description: string | null;
  /** Article summary. */
  summary: string | null;
  /** Article body. */
  body: string;
  /** Body format, commonly markdown. */
  body_format: string;
  /** SEO title. */
  seo_title: string | null;
  /** SEO description. */
  seo_description: string | null;
  /** Social share title. */
  social_title: string | null;
  /** Social share description. */
  social_description: string | null;
  /** Editor note or content note. */
  editor_note: string | null;
  /** Article disclosure or disclaimer text. */
  disclosure_text: string | null;
  /** Estimated reading time in minutes. */
  reading_time: number;
  /** Publish status. Public APIs return published translations only. */
  publish_status: string;
  /** Published timestamp as ISO string. */
  published_at: string | null;
  /** Translation workflow status. */
  translation_status: string;
  /** Source/reference URLs for the article. */
  sources: ArticleSource[];
};

/** Article wrapper. The public API returns one translation for the requested language. */
export type Article = {
  /** Article ID. */
  id: number;
  /** Site ID. */
  site_id: number;
  /** Category ID. */
  category_id: number;
  /** Editor/author ID. */
  editor_id: number | null;
  /** Canonical article slug. */
  canonical_slug: string;
  /** Article status. Public APIs return active articles only. */
  status: string;
  /** Source mode, for example manual or workflow. */
  source_mode: string;
  /** Article translations. Public APIs usually return exactly one translation. */
  translations: ArticleTranslation[];
};

/** Editor/author profile for author pages and article bylines. */
export type Editor = {
  /** Editor ID. */
  id: number;
  /** Site ID. */
  site_id: number;
  /** Stable editor slug used in editor detail URLs. */
  slug: string;
  /** Editor email, if configured. */
  email: string | null;
  /** Editor role. */
  role: string | null;
  /** Whether this editor is enabled. */
  enabled: boolean;
  /**
   * Actual content language returned.
   * May differ from requested language when editor translation falls back to site default language.
   */
  language: string | null;
  /** Display name. */
  display_name: string | null;
  /** Biography text. */
  bio: string | null;
  /** SEO title for editor page. */
  seo_title: string | null;
  /** SEO description for editor page. */
  seo_description: string | null;
};

/** Shared query params for paginated public list APIs. */
export type PublicListParams = {
  /** Requested language. Defaults to client defaultLanguage. */
  language?: string;
  /** Search keyword. */
  q?: string;
  /** Alias of q, useful for UI naming compatibility. */
  keyword?: string;
  /** Page number, starting from 1. */
  page?: number;
  /** Records per page, 1-100. */
  page_size?: number;
  /** Sort field. Supported values vary by endpoint. */
  sort?: string;
  /** Sort direction. */
  order?: SortOrder;
};

/** Query params for article lists. */
export type ArticleListParams = PublicListParams & {
  /** Filter by category slug. */
  category_slug?: string;
  /** Filter by source mode, for example manual or workflow. */
  source_mode?: string;
  /** Filter by editor ID. */
  editor_id?: number;
  /** Filter by publish date start, YYYY-MM-DD. */
  date_from?: string;
  /** Filter by publish date end, YYYY-MM-DD. */
  date_to?: string;
};

/** Query params for editor lists. */
export type EditorListParams = PublicListParams & {
  /** Whether to only return enabled editors. Defaults to true on the API side. */
  enabled?: boolean;
};

/** Query params for language list. */
export type LanguageListParams = {
  /** Whether to only return enabled languages. Defaults to true on the API side. */
  enabled?: boolean;
};

/** Client setup options. */
export type PublicCmsClientOptions = {
  /** CMS backend base URL, for example https://chuanmei.crawlsy.dpdns.org. */
  apiBase: string;
  /** Site slug from admin Site Management, for example global-city-wire. */
  siteSlug: string;
  /** Default request language used when a method does not receive language. */
  defaultLanguage?: string;
  /** Optional custom fetch implementation, useful for tests or custom runtimes. */
  fetcher?: typeof fetch;
};

/** Error thrown for non-2xx public API responses. */
export class PublicCmsError extends Error {
  /** HTTP status code. */
  status: number;
  /** Full request URL. */
  url: string;
  /** Raw response body. */
  body: string;

  constructor(message: string, status: number, url: string, body: string) {
    super(message);
    this.name = "PublicCmsError";
    this.status = status;
    this.url = url;
    this.body = body;
  }
}

/** Public CMS client for SSR sites. */
export class PublicCmsClient {
  private readonly apiBase: string;
  private readonly siteSlug: string;
  private readonly defaultLanguage: string;
  private readonly fetcher: typeof fetch;

  constructor(options: PublicCmsClientOptions) {
    this.apiBase = options.apiBase.replace(/\/+$/, "");
    this.siteSlug = options.siteSlug;
    this.defaultLanguage = options.defaultLanguage ?? "en";
    this.fetcher = options.fetcher ?? fetch;
  }

  /**
   * Get enabled site languages for frontend language switching.
   *
   * GET /api/sites/{site_slug}/languages
   */
  siteProfile() {
    return this.get<PublicSiteProfile>("/profile");
  }

  languages(params: LanguageListParams = {}) {
    return this.get<SiteLanguage[]>("/languages", params);
  }

  /**
   * Get category list for navigation and channel entry pages.
   *
   * GET /api/sites/{site_slug}/categories
   *
   * Language fallback: requested language -> site default language.
   */
  categories(params: PublicListParams = {}) {
    return this.get<PublicPage<Category>>("/categories", this.withLanguage(params));
  }

  /**
   * Get one category by slug.
   *
   * GET /api/sites/{site_slug}/categories/{category_slug}
   *
   * Language fallback: requested language -> site default language.
   */
  category(categorySlug: string, params: { language?: string } = {}) {
    return this.get<Category>(`/categories/${encodeURIComponent(categorySlug)}`, this.withLanguage(params));
  }

  /**
   * Get published article list.
   *
   * GET /api/sites/{site_slug}/articles
   *
   * Articles are strict by language: no translation in requested language means no record returned.
   */
  articles(params: ArticleListParams = {}) {
    return this.get<PublicPage<Article>>("/articles", this.withLanguage(params));
  }

  /**
   * Get one published article by article slug.
   *
   * GET /api/sites/{site_slug}/articles/{article_slug}
   *
   * Articles are strict by language. Use article.translations[0].sources for source URLs.
   */
  article(articleSlug: string, params: { language?: string } = {}) {
    return this.get<Article>(`/articles/${encodeURIComponent(articleSlug)}`, this.withLanguage(params));
  }

  /**
   * Get editor/author list.
   *
   * GET /api/sites/{site_slug}/editors
   *
   * Language fallback: requested language -> site default language.
   */
  editors(params: EditorListParams = {}) {
    return this.get<PublicPage<Editor>>("/editors", this.withLanguage(params));
  }

  /**
   * Get one editor/author by slug.
   *
   * GET /api/sites/{site_slug}/editors/{editor_slug}
   *
   * Language fallback: requested language -> site default language.
   */
  editor(editorSlug: string, params: { language?: string } = {}) {
    return this.get<Editor>(`/editors/${encodeURIComponent(editorSlug)}`, this.withLanguage(params));
  }

  private withLanguage<T extends { language?: string }>(params: T): T & { language: string } {
    return { ...params, language: params.language ?? this.defaultLanguage };
  }

  private async get<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
    const url = this.buildUrl(path, params);
    const response = await this.fetcher(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      const body = await response.text();
      throw new PublicCmsError(`Public CMS request failed with ${response.status}`, response.status, url, body);
    }
    return response.json() as Promise<T>;
  }

  private buildUrl(path: string, params: Record<string, unknown>): string {
    const url = new URL(`${this.apiBase}/api/sites/${encodeURIComponent(this.siteSlug)}${path}`);
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
    return url.toString();
  }
}

/** Create a Public CMS client. */
export function createPublicCmsClient(options: PublicCmsClientOptions) {
  return new PublicCmsClient(options);
}
