import { useState } from "react";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);

  const idiomas = [
    { nome: "Português", bandeira: "🇧🇷" },
    { nome: "English", bandeira: "🇺🇸" },
    { nome: "Español", bandeira: "🇪🇸" },
    { nome: "Français", bandeira: "🇫🇷" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/40 px-4 py-2 text-sm text-white hover:border-[#f2ff00] transition"
      >
        🌐 Português ▼
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-[#111] shadow-xl overflow-hidden">
          {idiomas.map((idioma) => (
            <button
              key={idioma.nome}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#f2ff00] hover:text-black transition"
            >
              <span>{idioma.bandeira}</span>
              {idioma.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
