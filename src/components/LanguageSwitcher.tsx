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
  const [selected, setSelected] = useState<Lang>(languages[0]);
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

  const changeLanguage = (langCode: string, langLabel: string) => {
    setSelected(
      languages.find((lang) => lang.code === langCode) ?? {
        code: langCode,
        label: langLabel,
        flag: "🌐",
      }
    );
    setOpen(false);

    const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;

    if (!combo) {
      console.warn("Google Translate ainda não carregou.");
      return;
    }

    combo.value = langCode;
    combo.dispatchEvent(new Event("change"));
  };

  return (
    <div ref={rootRef} className="relative z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-4 text-sm font-medium text-white transition hover:border-[#f2ff00]"
        type="button"
      >
        <span>{selected.flag}</span>
        <span>{selected.label}</span>
        <span>▼</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code, lang.label)}
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
