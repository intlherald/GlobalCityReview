export const siteConfig = {
  domain: "GlobalCityReview.com",
  name: "Global City Review",
  englishName: "Global City Review",
  slug: process.env.SITE_SLUG ?? "global-city-review",
  defaultLanguage: process.env.DEFAULT_LANGUAGE ?? "en",
  url: (process.env.SITE_URL ?? "https://www.globalcityreview.com").replace(/\/+$/, ""),
  contactEmail: process.env.CONTACT_EMAIL ?? "letters@globalcityreview.com",
  address: process.env.ADDRESS ?? "30 Cecil Street, Prudential Tower, Singapore 049712",
  apiBase: process.env.CMS_API_BASE ?? "https://chuanmei.crawlsy.dpdns.org",
  defaultOgImage:
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80"
};

export const languagePlan = [
  { language: "en", displayName: "English", nativeName: "English" },
  { language: "fr", displayName: "French", nativeName: "Français" },
  { language: "ar", displayName: "Arabic", nativeName: "العربية" },
  { language: "es", displayName: "Spanish", nativeName: "Español" },
  { language: "zh", displayName: "Chinese", nativeName: "简体中文" },
  { language: "it", displayName: "Italian", nativeName: "Italiano" }
] as const;

export const categoryImageFallbacks: Record<string, string> = {
  editorial:
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80",
  "city-analysis":
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80",
  "regional-outlook":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
  "expert-perspectives":
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
  reports:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80"
};

export const sectionOrder = [
  { key: "editorial" },
  { key: "city-analysis" },
  { key: "regional-outlook" },
  { key: "expert-perspectives" },
  { key: "reports" }
];
