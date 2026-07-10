import { GeneratorModel } from "./types";

export const companyName = "OCTA ENERGIA";
export const originalName = "OCTA ENERGIA";

export const generatorsData: GeneratorModel[] = [
  {
    id: "octa-15",
    powerKw: 15,
    name: "OCTA 15 Carenado",
    category: "Residencial e Comercial Leve",
    voltage: "110 / 220 / 380 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "2 a 3 m²",
    image: "/src/assets/images/gen_low_1782162084408.jpg",
    features: [
      "Operação extremamente silenciosa (<50 dB)",
      "Livre de combustão ou emissão de CO₂",
      "Indicadores inteligentes com interface microprocessada",
      "Perfeito para uso contínuo ou emergências domésticas"
    ],
    efficiency: "97% (Apenas 3% de perdas)",
    description: "Compacto e eficiente, projetado para residências de alto padrão e comércios de pequeno porte que necessitam de estabilidade total sem emissão de gases.",
    cooling: "Refrigeração a Ar Assistida",
    startingSystem: "Manual / Automático",
    warranty: "2 anos de fábrica",
    phase: "Trifásico / Monofásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-30",
    powerKw: 30,
    name: "OCTA 30 Carenado",
    category: "Comercial e Pequeno Agronegócio",
    voltage: "110 / 220 / 380 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "3 a 5 m²",
    image: "/src/assets/images/gen_low_1782162084408.jpg",
    features: [
      "Carenagem de aço galvanizado antiferrugem",
      "Livre de combustão ou emissão de CO₂",
      "Proteção acústica profunda com lã de rocha",
      "Adequado para consultórios, mercados e silos de pequeno porte"
    ],
    efficiency: "97% (Apenas 3% de perdas)",
    description: "Equipamento de segurança de energia robusto concebido para clínicas comerciais, padarias de alto fluxo e fazendas de transição energética rápida.",
    cooling: "Refrigeração a Ar Assistida",
    startingSystem: "Manual / Automático",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-50",
    powerKw: 50,
    name: "OCTA 50 Carenado",
    category: "Pequena e Média Empresa",
    voltage: "110 / 220 / 380 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "4 a 6 m²",
    image: "/src/assets/images/gen_low_1782162084408.jpg",
    features: [
      "Ampla isolação magnética de alta performance",
      "Controle digital integrado com CLP industrial",
      "Operação automatizada com partida suave",
      "Conexão segura para sistemas híbridos de bateria"
    ],
    efficiency: "97% (Apenas 3% de perdas)",
    description: "Excelente estabilizador de base elétrica para escritórios de engenharia, pequenas fazendas produtivas e redes de varejo de médio porte.",
    cooling: "Refrigeração de Fluxo Convectivo",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-100",
    powerKw: 100,
    name: "OCTA 100 Carenado",
    category: "Comercial e Agrícola",
    voltage: "110 / 220 / 380 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "5 a 8 m²",
    image: "/src/assets/images/gen_mid_1782162098287.jpg",
    features: [
      "Operação silenciosa (carenagem acústica)",
      "Livre de combustão ou emissão de CO₂",
      "Ficha Técnica Completa e suporte autônomo",
      "Acabamento robusto com pintura eletrostática epóxi"
    ],
    efficiency: "97% (Apenas 3% de perdas)",
    description: "Ideal para garantir a autonomia de pequenos negócios e propriedades agrícolas, oferecendo energia de forma contínua e sem interrupções das concessionárias.",
    cooling: "Refrigeração a Ar Assistida",
    startingSystem: "Manual / Automático",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-150",
    powerKw: 150,
    name: "OCTA 150 Carenado",
    category: "Pequena e Média Empresa",
    voltage: "110 / 220 / 380 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "6 a 10 m²",
    image: "/src/assets/images/gen_mid_1782162098287.jpg",
    features: [
      "Operação contínua 24/7 (Base Load)",
      "Cabine com isolamento térmico e acústico de alta performance",
      "Perfeito para comércio dinâmico e pequenas companhias",
      "Amortecimento mecânico avançado anti-vibração"
    ],
    efficiency: "97% (Apenas 3% de perdas)",
    description: "Perfeito para supermercados, condomínios de médio porte e pequenas indústrias que buscam se proteger de aumentos tarifários e apagões de rede.",
    cooling: "Refrigeração de Alta Densidade Térmica",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-200",
    powerKw: 200,
    name: "OCTA 200 Carenado",
    category: "Corporativo e Industrial",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "6 a 10 m²",
    image: "/src/assets/images/gen_mid_1782162098287.jpg",
    features: [
      "Carenagem acústica isolante de alta performance",
      "Rendimento real constante sem fadiga mecânica",
      "Regulador eletrônico de tensão ultra-rápido (AVR)",
      "Segurança energética total contra sobrecargas"
    ],
    efficiency: "97% (Apenas 3% de perdas)",
    description: "Solução extremamente confiável para supermercados, condomínios corporativos integrados e indústrias de manufatura de médio fluxo.",
    cooling: "Refrigeração Forçada Dinâmica",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-250",
    powerKw: 250,
    name: "OCTA 250 Carenado",
    category: "Indústria e Grandes Condomínios",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "8 a 12 m²",
    image: "/src/assets/images/gen_mid_1782162098287.jpg",
    features: [
      "Sistema GAEL de propensão eletromecânica magnética",
      "Rotor de alta inércia assistido por neodímio",
      "Design de ponta com blindagem acústica especial",
      "Zero emissão de fumaça, calor operacional excessivo ou CO₂"
    ],
    efficiency: "97% de eficiência eletromecânica",
    description: "Modelo potente habilitado para operar tanto de forma isolada (Off-grid) como em paralelo com a concessionária para otimização de picos (Peak Shaving).",
    cooling: "Refrigeração a Ar Forçada",
    startingSystem: "Manual / Automático",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-300",
    powerKw: 300,
    name: "OCTA 300 Carenado (Modelo Premium)",
    category: "Corporativo e Industrial",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "8 a 15 m²",
    image: "/src/assets/images/gen_mid_1782162098287.jpg",
    features: [
      "Concepção avançada de baixíssimo ruído",
      "Interface digital de controle inteligente com monitoramento remoto IoT",
      "Proteções elétricas robustas integradas com chave de transferência automática (ATS)",
      "Aço escovado e acabamento bronze metálico perfurado de alta resistência"
    ],
    efficiency: "97% (Apenas ~3% de perdas projetadas)",
    description: "Equipamento compacto e super sofisticado, projetado com acabamento bronze metálico perfurado e componentes magnéticos de alta resistência.",
    cooling: "Refrigeração a Ar de Alta Densidade",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-350",
    powerKw: 350,
    name: "OCTA 350 Carenado Premium",
    category: "Industrial e Infraestrutura",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "9 a 16 m²",
    image: "/src/assets/images/gen_closed_high_1782163011553.jpg",
    features: [
      "Cabine com tampas laterais fechadas e blindadas contra intempéries",
      "Design aerodinâmico selado sem chaminés de escape ou silenciadores aparentes",
      "Sincronismo avançado de barramentos",
      "Atenuação acústica industrial profunda com portas flush seladas"
    ],
    efficiency: "97% de eficiência contínua",
    description: "Projetado para infraestruturas comerciais robustas e condomínios industriais em crescimento que necessitam de transição imediata para base autônoma.",
    cooling: "Rotor de Alta Convecção Térmica",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-400",
    powerKw: 400,
    name: "OCTA 400 Carenado Industrial",
    category: "Alta Demanda Industrial",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "10 a 17 m²",
    image: "/src/assets/images/gen_closed_high_1782163011553.jpg",
    features: [
      "Carenagem de isolamento térmico e acústico profundo (Tampas Laterais Seladas)",
      "Design flush sem descargas ou silenciadores externos visíveis",
      "Eixo de rotação sustentado por mancais magnéticos permanentes de neodímio",
      "Suporta partidas industriais pesadas de motores e bombas de alto fluxo"
    ],
    efficiency: "97% de rendimento permanente",
    description: "Atendimento energético ininterrupto para indústrias petroquímicas e manufatureiras, oferecendo robustez eletromecânica sob severas variações de torque.",
    cooling: "Refrigeração a Fluxo Contínuo Magnético",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-450",
    powerKw: 450,
    name: "OCTA 450 Carenado Super-Duty",
    category: "Alta Demanda Industrial",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "10 a 18 m²",
    image: "/src/assets/images/gen_closed_high_1782163011553.jpg",
    features: [
      "Carenagem de isolamento térmico e acústico profundo (Tampas Laterais Seladas)",
      "Design flush sem descargas ou silenciadores externos visíveis",
      "Bobinas com blindagem eletromecânica de alta indução linear",
      "Sincronismo automático e interface SCADA integrada"
    ],
    efficiency: "97% (Altíssima linearidade de geração)",
    description: "Usinado sob os mais rígidos preceitos de resiliência e operação continuada, cobrindo com folga cargas reativas pesadas e distorções harmônicas industriais.",
    cooling: "Refrigeração Forçada Assistida Premium",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-500",
    powerKw: 500,
    name: "OCTA 500 Carenado Heavy-Duty",
    category: "Alta Demanda Industrial",
    voltage: "220 / 380 / 440 VCA",
    frequency: "50 / 60 Hz",
    areaNeeded: "10 a 18 m²",
    image: "/src/assets/images/gen_closed_high_1782163011553.jpg",
    features: [
      "Geração de 324.000 kWh/mês com fator de carga de 90%",
      "Cabine com tampas laterais fechadas e blindadas contra intempéries",
      "Design aerodinâmico selado sem chaminés de escape ou silenciadores aparentes",
      "Monitoramento dinâmico via CLP de última geração com interface IoT"
    ],
    efficiency: "97% de rendimento contínuo",
    description: "Ideal para aplicações intensivas de manufatura, redes de grandes hotéis, agronegócio de grande escala e plantas de mineração.",
    cooling: "Refrigeração Forçada Premium",
    startingSystem: "Automático Inteligente",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  },
  {
    id: "octa-1000",
    powerKw: 1000,
    name: "OCTA 1MW Megawatt Station",
    category: "Data Centers e Infraestrutura Crítica",
    voltage: "380 / 440 VCA ou Média Tensão",
    frequency: "50 / 60 Hz",
    areaNeeded: "15 a 30 m²",
    image: "/src/assets/images/generator_1mw_1781368367812.jpg",
    features: [
      "Configuração modular em contêiner marítimo acústico blindado",
      "Múltiplas unidades operando em paralelo com facilidade",
      "Integração total de sistemas inteligentes de controle eletrônico",
      "Sustentação independente de subestação com proteção integrada"
    ],
    efficiency: "97% de rendimento permanente",
    description: "A solução definitiva em independência energética para grandes data centers de IA, infraestrutura hospitalar e pólos industriais metalúrgicos.",
    cooling: "Refrigeração Climatizada de Fluxo Contínuo",
    startingSystem: "Automático com Paralelismo Automático",
    warranty: "2 anos de fábrica",
    phase: "Trifásico",
    waveType: "Senoidal Pura"
  }
];

export const financialPremises = {
  tariffDefault: 1.14, // R$ per kWh
  operatingFactor: 0.90, // 90%
};

export const aboutCompanyText = {
  subtitle: "Transformando a matriz de energia com tecnologia de ponta, sustentabilidade e inovação eletromecânica assistida magneticamente.",
  intro: "A OCTA ENERGIA, integrante do Grupo VALLEC PARTICIPAÇÕES, é um empreendimento tecnológico focado no desenvolvimento de soluções em energia limpa, eficiência energética profunda e geração estável, através de tecnologia nacional autônoma disruptiva.",
  paragraphs: [
    "Atuamos no encontro estratégico entre engenharia refinada, economia circular e física magnética assistida. Oferecemos produtos e serviços revolucionários capazes de transformar a relação que corporações, indústrias e o agronegócio têm com sua maior despesa operacional: a eletricidade.",
    "Nossa atuação está fundamentalmente consolidada em torno do Gerador de Energia Magnética Cinética (Sistema GAEL), inovação eletromecânica de alta performance com potência modular permanente de 100kW a 1MW, oferecendo uma resposta definitiva e 100% autônoma às instabilidades de fornecimento."
  ],
  pillars: [
    {
      title: "Autonomia & Geração Contínua",
      desc: "Sistemas modulares auto-estimulados que dispensam insumos climáticos como sol e ventos ou queima de combustíveis operacionais para entregar suprimento elétrico constante e seguro 24/7."
    },
    {
      title: "Gerador Magnético Cinético (GAEL)",
      desc: "Plataforma revolucionária baseada em rotores de alta inércia assistidos por campos magnéticos induzidos e permanentes de Neodímio, sustentando rotações com míseros 3% de perdas internas de projeto, sem queima de combustíveis operacionais."
    }
  ]
};

export const marketChallenges = {
  title: "O Cenário Crítico do Setor Energético",
  description: "O setor elétrico brasileiro enfrenta uma defasagem estrutural estimada em aproximadamente 30% na capacidade energética real. A dependência de chuvas, quebras de linhas de transmissão e escassez geram sobrecargas severas e crises tarifárias crônicas.",
  points: [
    {
      title: "Aumento Constante de Tarifas",
      desc: "Tributação, encargos e bandeiras tarifárias elevam o custo operacional real de indústrias e comércios a patamares inviáveis no longo prazo."
    },
    {
      title: "Sobrecarga Crônica de Rede",
      desc: "As redes de média e alta tensão operam próximas ao seu limite, gerando picos e flutuações prejudiciais a equipamentos sensíveis."
    },
    {
      title: "Atrasos em Obras de Transmissão",
      desc: "A infraestrutura de conexão de usinas distantes (solar/eólica) não acompanha o ritmo de novas cargas que demandam energia imediata, como datacenters de IA."
    },
    {
      title: "Risco Elevado de Apagões",
      desc: "A falta de geração de base (base load) pulverizada abre margem para instabilidades permanentes, exigindo que empresas busquem independência."
    }
  ],
  stats: [
    { value: "30%", label: "Defasagem estrutural da capacidade real brasileira" },
    { value: "+60%", label: "TIR média anualizada para projetos de auto-geração" },
    { value: "R$ 1,14", label: "Custo por kWh médio para tarifas comerciais/industriais" },
    { value: "Zero", label: "Emissões de carbono ou queima de fósseis no ciclo magnético" }
  ]
};
