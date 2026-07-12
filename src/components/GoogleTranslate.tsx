import React, { useEffect, useRef } from "react";

export function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'pt',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          'google_translate_element'
        );
      }
    };

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://google.com';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="inline-block min-w-[140px] text-sm" 
      translate="no" 
    />
  );
}
