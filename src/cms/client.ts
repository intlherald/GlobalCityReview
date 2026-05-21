import { createPublicCmsClient } from "./public";
import { siteConfig } from "@/lib/config";

export const cms = createPublicCmsClient({
  apiBase: siteConfig.apiBase,
  siteSlug: siteConfig.slug,
  defaultLanguage: siteConfig.defaultLanguage,
  fetcher: (input, init) =>
    fetch(input, {
      ...init,
      next: { revalidate: 180 }
    })
});
