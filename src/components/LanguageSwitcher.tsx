export default function LanguageSwitcher() {
  const openGoogleTranslate = () => {
    const button = document.querySelector(
      ".goog-te-gadget-simple a"
    ) as HTMLAnchorElement | null;

    if (!button) {
      console.warn("Google Translate não carregou.");
      return;
    }

    button.click();
  };

  return (
    <button
      onClick={openGoogleTranslate}
      className="
        flex
        items-center
        gap-2
        h-11
        px-4
        rounded-lg
        border
        border-white/15
        bg-black/40
        text-white
        text-sm
        font-medium
        transition
        hover:border-[#f2ff00]
      "
      type="button"
    >
      <span>🌐</span>
      <span>Idioma</span>
      <span>▼</span>
    </button>
  );
}
