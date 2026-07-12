import React, { useState } from "react";

export function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "pt", label: "Português", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const handleTranslate = (langCode: string) => {
    // Captura o link completo da página atual
    const currentUrl = window.location.href;

    if (langCode === "pt") {
      // Se for português, remove as barras de tradução antigas e limpa o link
      window.location.href = window.location.origin + window.location.pathname;
    } else {
      // Redirecionamento oficial e seguro pela API Web estável do Google Translate
      window.location.href = `https://google.com{langCode}&u=${encodeURIComponent(currentUrl)}`;
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" style={{ zIndex: 9999 }}>
      {/* Botão visível criado no React */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 transition-all duration-200"
      >
        <span style={{ color: "#f2ff00" }}>🌐</span>
        <span>Idioma</span>
        <span className="text-[10px] opacity-70">▼</span>
      </button>

      {/* Menu flutuante que abre ao clicar */}
      {isOpen && (
        <>
          {/* Fundo invisível para fechar ao clicar fora */}
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
