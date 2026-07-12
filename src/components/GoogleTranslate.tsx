import React, { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

export function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const handleTranslate = (langCode: string) => {
    const currentUrl = window.location.href;
    if (langCode === "pt") {
      window.location.href = currentUrl.split("?")[0];
    } else {
      window.location.href = `https://google.com{langCode}&u=${encodeURIComponent(currentUrl)}`;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-all duration-200"
      >
        <Globe className="w-4 h-4 text-[#f2ff00]" />
        <span>Idioma</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#0d1117] border border-slate-800 p-1 shadow-2xl z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleTranslate(lang.code)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors text-left"
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
