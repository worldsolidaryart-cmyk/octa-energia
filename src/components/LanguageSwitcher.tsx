import { useEffect, useRef, useState } from "react";

const languages = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(languages[0]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  const changeLanguage = (lang: typeof languages[0]) => {
    setCurrent(lang);
    setOpen(false);

    if (lang.code === "pt") {
      document.cookie =
        "googtrans=/pt/pt;path=/;domain=" + window.location.hostname;
    } else {
      document.cookie =
        "googtrans=/pt/" +
        lang.code +
        ";path=/;domain=" +
        window.location.hostname;
    }

    document.cookie =
      "googtrans=/pt/" +
      lang.code +
      ";path=/";

    window.location.reload();
  };

  return (
    <div ref={ref} className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="
        flex
        items-center
        gap-2
        h-11
        px-4
        rounded-xl
        border
        border-white/15
        bg-black/40
        text-white
        text-sm
        font-medium
        transition
        hover:border-[#f2ff00]
        "
      >
        <span>{current.flag}</span>

        {current.label}

        <span>▼</span>
      </button>

      {open && (
        <div
          className="
          absolute
          right-0
          mt-2
          w-48
          rounded-xl
          overflow-hidden
          bg-[#111]
          border
          border-white/10
          shadow-2xl
          z-50
          "
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang)}
              className="
              flex
              items-center
              gap-3
              w-full
              px-4
              py-3
              text-white
              text-left
              hover:bg-[#f2ff00]
              hover:text-black
              transition
              "
            >
              <span>{lang.flag}</span>

              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
