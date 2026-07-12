import React, { useEffect, useRef } from "react";

export function GoogleTranslate() {
  const initialized = useRef(false);

  useEffect(() => {
    // Impede dupla inicialização em ambientes React modernos
    if (initialized.current) return;
    initialized.current = true;

    // 1. Cria a configuração de tradução exigida pelo Google
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

    // 2. Injeta de forma segura o script apenas se ele não existir na sessão
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
      className="inline-block"
      style={{ minHeight: '32px' }}
      translate="no" // Garante que o tradutor não tente traduzir seu próprio botão
    />
  );
}
