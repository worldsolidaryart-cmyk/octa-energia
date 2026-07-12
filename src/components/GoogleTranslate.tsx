import React, { useEffect } from "react";

export function GoogleTranslate() {
  useEffect(() => {
    // 1. Cria a função de inicialização que o robô do Google exige encontrar
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'pt',
            // O layout SIMPLE gera o seletor clássico de idiomas compacto
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      }
    };

    // 2. Injeta o script oficial do Google Tradutor de forma fixa
    const scriptId = 'google-translate-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      // Se o script já existia em cache, força o re-carregamento imediato do botão
      if ((window as any).googleTranslateElementInit) {
        (window as any).googleTranslateElementInit();
      }
    }
  }, []);

  return (
    // O contêiner recebe uma largura mínima para garantir que o Google desenhe o botão sem sumir
    <div 
      id="google_translate_element" 
      className="inline-block min-w-[140px] text-sm align-middle"
      style={{ minHeight: '32px' }}
      translate="no" // Impede que o Google tente traduzir o próprio seletor
    />
  );
}
