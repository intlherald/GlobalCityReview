import { useTranslations } from "next-intl";

export function ErrorState({ title, message }: { title?: string; message?: string }) {
  const t = useTranslations("states");
  return (
    <section className="state state-error">
      <p className="eyebrow">{t("serviceNotice")}</p>
      <h1>{title ?? t("errorTitle")}</h1>
      <p>{message ?? t("errorMessage")}</p>
    </section>
  );
}
