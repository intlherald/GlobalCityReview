import { useTranslations } from "next-intl";

export function EmptyState({ title, message }: { title?: string; message?: string }) {
  const t = useTranslations("states");
  return (
    <section className="state">
      <p className="eyebrow">{t("noRecords")}</p>
      <h2>{title ?? t("emptyTitle")}</h2>
      <p>{message ?? t("emptyMessage")}</p>
    </section>
  );
}
