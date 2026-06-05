import { useTranslations } from "next-intl";
import type { ArticleSource } from "@/cms/public";

export function SourceLinks({ sources }: { sources: ArticleSource[] }) {
  const t = useTranslations("article");
  return (
    <section className="source-box">
      <p className="eyebrow">{t("sourcesEyebrow")}</p>
      <h2>{t("sourcesTitle")}</h2>
      {sources.length === 0 ? (
        <p>{t("noSources")}</p>
      ) : (
        <ol>
          {sources.map((source) => (
            <li key={source.id}>
              <a href={source.source_url} target="_blank" rel="noreferrer">
                {source.source_url}
              </a>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
