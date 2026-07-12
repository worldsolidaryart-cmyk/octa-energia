import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    let mounted = true;

    const init = () => {
      if (!mounted) return;

      const container = document.getElementById("google_translate_element");
      if (!container) {
        setTimeout(init, 200);
        return;
      }

      if (!window.google?.translate?.TranslateElement) {
        setTimeout(init, 200);
        return;
      }

      container.innerHTML = "";

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    window.googleTranslateElementInit = init;

    const existingScript = document.getElementById("google-translate-script") as HTMLScriptElement | null;

    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    } else {
      init();
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
      <div
          id="google_translate_element"
          className="translate-button"
          translate="no"
      />
  );
}
