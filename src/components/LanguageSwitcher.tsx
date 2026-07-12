import { useEffect, useRef, useState } from "react";

type Lang = {
  code: string;
  label: string;
  flag: string;
};

const languages: Lang[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Lang>(languages[0]);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const openGoogleMenu = () => {
    const trigger = document.querySelector(
      ".goog-te-gadget-simple a"
    ) as HTMLAnchorElement | null;

    if (!trigger) {
      console.warn("Menu do Google Translate ainda não está disponível.");
      return;
    }

    trigger.click();
  };

  const selectLanguage = (lang: Lang) => {
    setCurrent(lang);
    setOpen(false);

    if (lang.code === "pt") {
      openGoogleMenu();
      return;
    }

    openGoogleMenu();

    setTimeout(() => {
      const items = Array.from(
        document.querySelectorAll(".goog-te-menu2-item span.text")
      ) as HTMLSpanElement[];

      const match = items.find((el) => {
        const text = el.textContent?.trim().toLowerCase() ?? "";
        return text === lang.label.toLowerCase();
      });

      if (match) {
        const clickable = match.closest("a, div") as HTMLElement | null;
        clickable?.click();
      } else {
        const fallbackItems = Array.from(
          document.querySelectorAll(".goog-te-menu2-item")
        ) as HTMLElement[];

        const fallback = fallbackItems.find((el) => {
          const text = el.textContent?.trim().toLowerCase() ?? "";
          return text.includes(lang.label.toLowerCase());
        });

        fallback?.click();
      }
    }, 350);
  };

  return (
    <div ref={rootRef} className="relative z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        type="button"
        className="flex h-11 items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-4 text-sm font-medium text-white transition hover:border-[#f2ff00]"
      >
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span>▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => selectLanguage(lang)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white transition hover:bg-[#f2ff00] hover:text-black"
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
