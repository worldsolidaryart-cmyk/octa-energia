import React, { useEffect, useState } from "react";

export function GoogleTranslate() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // 1. Cria a função que o Google Translate vai chamar para inicializar
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'pt',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    };

    // 2. Injeta o script se ele já não existir na página
    const id = 'google-translate-script';
    let script = document.getElementById(id) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'text/javascript';
      script.src = 'https://google.com';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
      // Se o script já foi baixado antes, força a reinicialização manual
      if ((window as any).googleTranslateElementInit) {
        (window as any).googleTranslateElementInit();
      }
    }
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="inline-block scale-90 origin-right min-w-[130px]"
      style={{ minHeight: '32px' }}
      translate="no"
    />
  );
}
