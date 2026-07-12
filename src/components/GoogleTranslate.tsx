import { useEffect } from 'react';

declare global {
  interface window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    // Define a função global que o script do Google vai chamar
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
  }, []);

  return <div id="google_translate_element" className="inline-block" />;
}
