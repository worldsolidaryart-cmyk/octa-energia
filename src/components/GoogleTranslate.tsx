import { useEffect } from 'react';

export function GoogleTranslate() {
  useEffect(() => {
    // 1. Verifica se o script já não foi adicionado antes para evitar duplicidade
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//://google.com';
      document.body.appendChild(script); // Injeta o script de forma segura pelo ciclo do React
    }

    // 2. Define a função global de inicialização exigida pelo Google
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

  // Retorna a div envelopada para que o Google atue apenas dentro dela e não quebre o React
  return (
    <div 
      id="google_translate_element" 
      className="inline-block" 
      translate="no" // Impede que o Google tente traduzir o próprio botão do tradutor
    />
  );
}
