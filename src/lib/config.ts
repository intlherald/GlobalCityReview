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
  defaultOgImage: "/images/gcr-editorial.jpg"
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
  editorial: "/images/gcr-editorial.jpg",
  "city-analysis": "/images/gcr-city-analysis.jpg",
  "regional-outlook": "/images/gcr-regional-outlook.jpg",
  "expert-perspectives": "/images/gcr-expert-perspectives.jpg",
  reports: "/images/gcr-reports.jpg"
};

export const sectionOrder = [
  { key: "editorial" },
  { key: "city-analysis" },
  { key: "regional-outlook" },
  { key: "expert-perspectives" },
  { key: "reports" }
];
