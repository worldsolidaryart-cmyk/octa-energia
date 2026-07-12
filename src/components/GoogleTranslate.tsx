import React, { useState } from "react";

export function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const handleTranslate = (langCode: string) => {
    // Pega o domínio limpo do site (ex: vallecggroup.com.br ou localhost:5173)
    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;

    if (langCode === "pt") {
      // Se for português, volta para o site original limpo
      window.location.href = `https://${currentDomain}${currentPath}`;
    } else {
      // NOVO FORMATO OFICIAL: Transforma a URL no espelho de tradução da Google (.translate.goog)
      // Exemplo: https://translate.goog
      const formattedDomain = currentDomain.replace(/\./g, "-");
      window.location.href = `https://${formattedDomain}.translate.goog${currentPath}?_x_tr_sl=pt&_x_tr_tl=${langCode}`;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" style={{ zIndex: 9999 }}>
      {/* Botão do Seletor */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-all duration-200"
      >
        <span style={{ color: "#f2ff00" }}>🌐</span>
        <span>Idioma</span>
        <span className="text-[10px] opacity-70">▼</span>
      </button>

      {/* Menu de Opções Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0" 
            style={{ zIndex: 9998 }} 
            onClick={() => setIsOpen(false)} 
          />
          <div 
            className="absolute right-0 mt-2 w-40 rounded-xl bg-[#0d1117] border border-slate-800 p-1 shadow-2xl" 
            style={{ zIndex: 9999 }}
          >
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
