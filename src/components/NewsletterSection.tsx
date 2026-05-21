import { useTranslations } from "next-intl";

export function NewsletterSection() {
  const t = useTranslations("newsletter");

  return (
    <section className="newsletter-section" aria-labelledby="newsletter-title">
      <div className="newsletter-copy">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 id="newsletter-title">{t("title")}</h2>
        <p>{t("description")}</p>
      </div>
      <form className="newsletter-form" aria-label={t("formLabel")}>
        <input name="email" type="email" placeholder={t("placeholder")} aria-label={t("emailLabel")} />
        <button type="button">{t("button")}</button>
        <p>{t("note")}</p>
      </form>
    </section>
  );
}
