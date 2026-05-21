"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { SiteLanguage } from "@/cms/public";
import { isLocaleSegment, localizedPath } from "@/i18n/routing";

function languageLabel(language: SiteLanguage) {
  return language.native_name ?? language.display_name ?? language.language;
}

export function LanguageSwitcher({
  languages,
  currentLocale,
  ariaLabel,
  fallbackLabel
}: {
  languages: SiteLanguage[];
  currentLocale: string;
  ariaLabel: string;
  fallbackLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabledLanguages = languages.filter((language) => isLocaleSegment(language.language));
  const currentLanguage = enabledLanguages.find((language) => language.language === currentLocale) ?? enabledLanguages[0];
  const query = searchParams.toString();

  const restPath = useMemo(() => pathname.replace(/^\/[^/]+/, "") || "/", [pathname]);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const currentIndex = Math.max(
      enabledLanguages.findIndex((language) => language.language === currentLocale),
      0
    );
    optionRefs.current[currentIndex]?.focus();
  }, [currentLocale, enabledLanguages, open]);

  if (enabledLanguages.length === 0 || !currentLanguage) {
    return <span className="language-fallback">{fallbackLabel}</span>;
  }

  function targetHref(locale: string) {
    const path = localizedPath(locale, restPath);
    return query ? `${path}?${query}` : path;
  }

  function navigate(locale: string) {
    window.location.assign(targetHref(locale));
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = optionRefs.current.findIndex((element) => element === document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      rootRef.current?.querySelector<HTMLButtonElement>(".language-trigger")?.focus();
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (Math.max(currentIndex, 0) + direction + enabledLanguages.length) % enabledLanguages.length;
      optionRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <div className="language-switcher" ref={rootRef} onKeyDown={handleMenuKeyDown}>
      <button
        type="button"
        className="language-trigger"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{languageLabel(currentLanguage)}</span>
        <span className="language-code">{currentLanguage.language.toUpperCase()}</span>
        <span className="language-caret" aria-hidden="true" />
      </button>
      {open && (
        <div className="language-menu" role="menu" aria-label={ariaLabel}>
          {enabledLanguages.map((language, index) => (
            <button
              key={language.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="menuitemradio"
              aria-checked={language.language === currentLocale}
              className={language.language === currentLocale ? "language-option active" : "language-option"}
              onClick={() => {
                setOpen(false);
                navigate(language.language);
              }}
            >
              <span>{languageLabel(language)}</span>
              <span>{language.language.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
