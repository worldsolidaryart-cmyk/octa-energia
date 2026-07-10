import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  QrCode, 
  Bot, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  CheckCheck, 
  Check, 
  Database, 
  FileText, 
  Phone, 
  Shield, 
  Zap, 
  Trash2, 
  X, 
  Play, 
  Bell, 
  CheckSquare,
  MessageSquare
} from "lucide-react";
import { generatorsData } from "../data";

interface LogMessage {
  id: string;
  timestamp: string;
  type: "system" | "incoming" | "agent-thought" | "tool" | "outgoing";
  text: string;
}

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isToolResponse?: boolean;
  toolUsed?: string;
}

export default function WhatsAppAgentConsole() {
  // Connection states
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "pairing" | "connected">("disconnected");
  const [pairingProgress, setPairingProgress] = useState(0);
  const [activeSession, setActiveSession] = useState({
    sessionName: "OCTA-MKT-AGENT-01",
    phoneNumber: "+55 (85) 99689-8895",
    deviceName: "Admin Server (BS DESIGN, Sala 711)",
    scannedAt: "",
  });

  // Agent configuration states
  const [agentName, setAgentName] = useState("OCTA Advancer");
  const [agentPersonality, setAgentPersonality] = useState("consultor_comercial");
  const [systemPrompt, setSystemPrompt] = useState(
    "Você é o OCTA Advancer, o agente de IA autônomo da OCTA ENERGIA. Sua missão é realizar o atendimento comercial de alta relevância B2B via WhatsApp. Seja focado em eficiência energética, demonstre autoridade técnica sobre os geradores cinéticos GAEL (100kW a 1MW), enfatize o modelo de utilidade ESCO (CAPEX Zero e faturamento com desconto garantido) ou Venda Direta com faturamento facilitado (50% de sinal de engenharia, 50% na saída da fábrica e ativação definitiva). Seja conciso, objetivo e use formatação limpa (negritos) apropriada para WhatsApp."
  );
  const [aiTemperature, setAiTemperature] = useState(0.4);
  const [autoResponseDelay, setAutoResponseDelay] = useState(2.5); // seconds
  const [allowedTools, setAllowedTools] = useState({
    calcViability: true,
    dispatchLead: true,
    pdfProposal: true,
    scheduleMeeting: true,
  });

  // WhatsApp chat states
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m-init-1",
      sender: "agent",
      text: "Olá! Seja bem-vindo ao suporte comercial inteligente da *OCTA ENERGIA*. ⚡\n\nEu sou o *OCTA Advancer*, assistente virtual autônomo de atendimento. Como posso otimizar a matriz energética da sua empresa hoje?\n\nDigite sua dúvida ou escolha uma das simulações rápidas abaixo!",
      timestamp: "17:15",
      status: "read"
    }
  ]);
  const [userInputValue, setUserInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // System Logs
  const [logs, setLogs] = useState<LogMessage[]>([
    {
      id: "l-1",
      timestamp: "17:09:05",
      type: "system",
      text: "WhatsApp Webhook Listener inicializado na porta 3000/api/whatsapp-webhook."
    },
    {
      id: "l-2",
      timestamp: "17:09:06",
      type: "system",
      text: "Serviço de IA generativa (Gemini API SDK @google/genai) pronto com modelo gemini-2.5-flash."
    },
    {
      id: "l-3",
      timestamp: "17:09:07",
      type: "system",
      text: "Aguardando leitura do QR Code seguro para acoplamento do dispositivo..."
    }
  ]);

  const logIndexRef = useRef(4);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // Handle preset system prompt changes based on personality select
  const handlePersonalityChange = (val: string) => {
    setAgentPersonality(val);
    if (val === "consultor_comercial") {
      setAgentName("OCTA Advancer");
      setSystemPrompt(
        "Você é o OCTA Advancer, o agente de IA autônomo da OCTA ENERGIA. Sua missão é realizar o atendimento comercial de alta relevância B2B via WhatsApp. Seja focado em eficiência energética, demonstre autoridade técnica sobre os geradores cinéticos GAEL (100kW a 1MW), enfatize o modelo de utilidade ESCO (CAPEX Zero e faturamento com desconto garantido) ou Venda Direta com faturamento facilitado (50% de sinal de engenharia, 50% na saída da fábrica e ativação definitiva). Seja conciso, objetivo e use formatação limpa (negritos) apropriada para WhatsApp."
      );
    } else if (val === "engenheiro_tecnico") {
      setAgentName("Eng. Mateus (OCTA)");
      setSystemPrompt(
        "Você é o Eng. Mateus, o agente especialista em física eletromecânica e dimensionamento de carga da OCTA ENERGIA. Responda dúvidas extremamente difíceis sobre rotores de neodímio, área necessária (5 a 8 m² para 100kW, 10 a 18 m² para 500kW), eficiência de 97% com apenas 3% de perdas e sinergias com sistemas BESS (baterias de lítio) Off-Grid. Seja centrado em métricas, dados de engenharia operacional e padrões de segurança de base load."
      );
    } else if (val === "fechador_b2b") {
      setAgentName("Dr. Carvalho (Vallec / OCTA)");
      setSystemPrompt(
        "Você é o Dr. Carvalho, o agente de contratos comerciais seniores e modelagem jurídica da OCTA ENERGIA, integrada ao Grupo VALLEC PARTICIPAÇÕES. Seu foco principal é destravar contratos corporativos de locação (ESCO) com desconto garantido de tarifas de concessionária sem investimento inicial de capitais (CAPEX ZERO). Apresente os termos de garantia, responsabilidade integral de manutenção por parte da OCTA, e valide a idoneidade operacional da empresa sediada no BS DESIGN, Aldeota."
      );
    }
  };

  // Push helper for logs
  const addLog = (type: LogMessage["type"], text: string) => {
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const timestamp = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    setLogs(prev => [
      ...prev,
      {
        id: `l-gen-${logIndexRef.current++}`,
        timestamp,
        type,
        text
      }
    ]);
  };

  // Handle connection start and pairing simulation
  const startPairing = () => {
    setConnectionStatus("pairing");
    setPairingProgress(0);
    addLog("system", "Iniciando processo de pareamento do dispositivo via Handshake Seguro...");
  };

  useEffect(() => {
    if (connectionStatus !== "pairing") return;

    const interval = setInterval(() => {
      setPairingProgress(prev => {
        const next = prev + Math.floor(Math.random() * 20) + 10;
        if (next >= 100) {
          clearInterval(interval);
          setConnectionStatus("connected");
          const now = new Date();
          setActiveSession(prevSess => ({
            ...prevSess,
            scannedAt: `${now.toLocaleDateString()} às ${now.toLocaleTimeString()}`
          }));
          addLog("system", "✓ Handshake concluído. Conectado ao WhatsApp ID de sessão: OCTA-MKT-AGENT-01");
          addLog("system", "📲 Instância vinculada ao número +55 (85) 99689-8895 (Dispositivo ativo).");
          addLog("system", "🤖 Agente de Inteligência Artificial pareado eletronicamente e respondendo no gatilho de Webhook.");
          return 100;
        }
        
        // Intermediate logs during connection
        if (next > 25 && next < 45) {
          addLog("system", "QR Code lido pelo dispositivo. Descriptografando token de sessão...");
        } else if (next > 65 && next < 85) {
          addLog("system", "Montando túnel WebSocket com servidores Meta Cloud API...");
        }

        return next;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [connectionStatus]);

  const disconnectSession = () => {
    setConnectionStatus("disconnected");
    addLog("system", "⚠ Dispositivo desconectado pelo administrador.");
    addLog("system", "Webhook inativo. WhatsApp desconectado.");
  };

  // Agent intelligence response engine (High fidelity simulator)
  const processAgentResponse = (userText: string) => {
    setIsTyping(true);
    addLog("incoming", `Mensagem recebida de +55 (11) 98765-4300: "${userText}"`);
    addLog("agent-thought", `Pensamento do Agente IA [${agentName}]: Analisando o texto com o Prompt de Sistema (${agentPersonality}). Buscando ferramentas...`);

    const lowerText = userText.toLowerCase();
    let reply = "";
    let toolUsed = "";

    // Keyword matching with premium domain logic
    if (lowerText.includes("potencia") || lowerText.includes("potência") || lowerText.includes("modelos") || lowerText.includes("qual") || lowerText.includes("quais") || lowerText.includes("gerador") || lowerText.includes("geradores")) {
      // Products tool
      toolUsed = "buscarModelosDisponiveis";
      addLog("tool", `[TOOL CALL] Executando ferramenta de banco de dados 'buscarModelosDisponiveis'`);
      
      const list = generatorsData.map(g => `• *${g.name}*: Potência de *${g.powerKw} kW* - Ideal para *${g.category}* (Eficiência eletromecânica de ${g.efficiency})`).join("\n");
      
      reply = `Aqui estão os nossos geradores magnéticos cinéticos disponíveis hoje na linha de produção da *OCTA ENERGIA*:\n\n${list}\n\nTodos os nossos ativos operam em regime kontínuo *24/7 (Base Load)* de forma 100% autônoma e limpa. Qual destas potências faz mais sentido para a sua atual demanda operacional?`;
      addLog("tool", `[TOOL SUCCESS] Retornado ${generatorsData.length} modelos de geradores do portfólio.`);
      
    } else if (lowerText.includes("viabilidade") || lowerText.includes("simular") || lowerText.includes("economia") || lowerText.includes("economizar") || lowerText.includes("kw") || /[0-9]+/.test(lowerText) && (lowerText.includes("simula") || lowerText.includes("projeto"))) {
      // Calculator tool
      toolUsed = "calcularViabilidadeFinanceira";
      addLog("tool", `[TOOL CALL] Executando ferramenta algorítmica 'calcularViabilidadeFinanceira'`);
      
      // Extract numbers or use default 500kW
      const match = lowerText.match(/([0-9]+)/);
      const kw = match ? parseInt(match[0]) : 500;
      
      const tariff = 1.14; 
      const uptime = 0.90; // 90% factor
      const monthlyGeneration = kw * 24 * 30 * uptime; // kWh/mês
      const monthlySavings = monthlyGeneration * tariff; // R$ economia bruta
      const annualSavings = monthlySavings * 12;
      const trees = Math.round(monthlyGeneration * 12 * 0.4 / 20); // standard absorption metric

      reply = `*⚡ SIMULAÇÃO DE VIABILIDADE TÉCNICA E FINANCEIRA*\n\nDimensionamento sugerido: *${kw} kW*\n\n📈 *Indicadores Projetados:*\n• Geração Estimada: *${(monthlyGeneration/1000).toFixed(1)} MWh/mês*\n• Economia Bruta Mensal: *R$ ${(monthlySavings/1000).toFixed(1)} mil*\n• Economia Bruta Anual: *R$ ${(annualSavings/1000000).toFixed(2)} Milhões*\n• Absorção de Carbono: equivalente a *${trees.toLocaleString()} árvores nativas* plantadas/ano.🛡️\n\n*Modelo de Negócio Recomendado:* Contrato de Locação *ESCO (CAPEX ZERO)*, onde nós assumimos 100% da fabricação, instalação e manutenção do gerador e sua empresa apenas paga pela energia consumida com desconto contratual garantido de até *20%*!\n\nGostaria que eu gerasse a *Proposta Comercial Científica formal em PDF* inteligente agora mesmo?`;
      addLog("tool", `[TOOL SUCCESS] MathEngine concluído para dimensionamento de ${kw} kW. Retorno calculado de R$ ${(annualSavings/1000000).toFixed(2)}M/Ano.`);
      
    } else if (lowerText.includes("preco") || lowerText.includes("preço") || lowerText.includes("quanto") || lowerText.includes("custo") || lowerText.includes("comercial") || lowerText.includes("sinal") || lowerText.includes("pagamento") || lowerText.includes("faturamento")) {
      // Commercial terms
      toolUsed = "obterRegrasDeFaturamento";
      addLog("tool", `[TOOL CALL] Executando ferramenta de políticas comerciais 'obterRegrasDeFaturamento'`);
      
      reply = `Os modelos comerciais da *OCTA ENERGIA* são focados em flexibilidade operacional e segurança jurídica para grandes contas B2B:\n\n1️⃣ *Venda Direta de Ativos (Aquisição):*\n• Faturamento corrigido e super facilitado: *50% de sinal de engenharia* para início da produção na planta fabril, e *50% na saída da fábrica e ativação definitiva* nas suas instalações.\n• Garantia total de fábrica de *2 anos*.\n\n2️⃣ *Contrato ESCO (Leasing de Energia - CAPEX ZERO):*\n• Investimento inicial de capital zero por parte da sua empresa.\n• A OCTA instala, opera e faz as manutenções, e cobra uma fatura mensal exclusivamente pelo que for consumido, com deságio garantido de até *20%* sobre a tarifa base da sua distribuidora.\n\nQual destas modalidades regulatórias é preferida pela diretoria da sua organização?`;
      addLog("tool", `[TOOL SUCCESS] Detalhamento comercial despachado com as condições corretas.`);
      
    } else if (lowerText.includes("tecnologia") || lowerText.includes("funcionamento") || lowerText.includes("funciona") || lowerText.includes("imã") || lowerText.includes("ímã") || lowerText.includes("neodímio") || lowerText.includes("gael") || lowerText.includes("seletivo")) {
      // Technical knowledge tool
      toolUsed = "buscarBaseDeConhecimentoGael";
      addLog("tool", `[TOOL CALL] Executando ferramenta de base cognitiva 'buscarBaseDeConhecimentoGael'`);
      
      reply = `O sistema *GAEL (Gerador de Energia Magnética Cinética Autônomo)* representa um divisor de águas tecnológico desenvolvido autonomamente no país.\n\nEle funciona através de acoplamentos cinéticos circulares pesados alimentados por indução de fluxo induzido e *ímãs de Neodímio de terras raras* de alta densidade gaussiana.\n\nA tecnologia utiliza loops de indução eletromagnética seletiva para operar continuamente, minimizando o atrito físico e alcançando uma eficiência global recorde de *97%*!\n\nIsto significa que, ao contrário dos geradores tradicionais ou painéis solares, o GAEL *não depende de sol, vento ou combustível fóssil* - ele entrega energia puramente constante (Base Load) 24 horas por dia.🔋`;
      addLog("tool", `[TOOL SUCCESS] Detalhes técnicos sobre neodímio e sistema GAEL retornados com sucesso.`);
      
    } else if (lowerText.includes("quem somos") || lowerText.includes("empresa") || lowerText.includes("grupo") || lowerText.includes("vallec") || lowerText.includes("sede") || lowerText.includes("endereço") || lowerText.includes("design") || lowerText.includes("onde fica")) {
      // Contact & Corporate info
      toolUsed = "obterMetadadosDaSede";
      addLog("tool", `[TOOL CALL] Executando ferramenta corporativa 'obterMetadadosDaSede'`);
      
      reply = `A *OCTA ENERGIA* é um empreendimento de inovação e engenharia profunda focado em descarbonização e soberania energética corporativa B2B, integrante do renomado *Grupo VALLEC PARTICIPAÇÕES*.\n\n🏢 *Nossa Sede Operacional Comercial:*\n• Avenida Desembargador Moreira, 1300\n• Empresarial *BS DESIGN*, Sala 711 T-Norte - Aldeota\n• Fortaleza - CE, CEP 60170-002\n\nEstamos localizados em um dos edifícios corporativos mais modernos e sustentáveis do Brasil (Certificação LEED Gold) para garantir um alto nível de governança corporativa a todos os nossos clientes nacionais do agronegócio e da indústria.`;
      addLog("tool", `[TOOL SUCCESS] Informações do Grupo VALLEC e BS DESIGN resgatadas.`);
      
    } else {
      // General response matching prompt
      toolUsed = "consultarIAFinetuned";
      addLog("tool", `[TOOL CALL] Executando consulta de modelo neural generativo 'consultarIAFinetuned' com temperatura ${aiTemperature}`);
      
      reply = `Entendi perfectamente sua questão comercial sobre a *OCTA ENERGIA*.\n\nOperando no modelo de geração limpa e contínua (*Base Load*), a tecnologia dos nossos geradores cinéticos propõe uma eliminação definitiva do Capex industrial pesado e mitigação de multas de demanda da concessionária.\n\nPara que eu possa responder à sua pergunta com a máxima precisão de engenharia do nosso time, você poderia me informar qual é a *potência em kW* que sua indústria consome atualmente ou qual o valor médio da sua conta de energia da distribuidora?`;
      addLog("tool", `[TOOL SUCCESS] IA Generativa respondeu inteligentemente via Prompt Padrão.`);
    }

    // Set simulator typing timer
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          id: `m-agent-${Date.now()}`,
          sender: "agent",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "read",
          isToolResponse: !!toolUsed,
          toolUsed: toolUsed || undefined
        }
      ]);
      addLog("outgoing", `Resposta do Agente IA [${agentName}] enviada para +55 (11) 98765-4300 via Canal WhatsApp.`);
    }, autoResponseDelay * 1000);
  };

  // User sends custom message in simulator
  const handleUserSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInputValue.trim()) return;

    const userText = userInputValue;
    setUserInputValue("");

    // Add to chat immediately
    setChatMessages(prev => [
      ...prev,
      {
        id: `m-user-${Date.now()}`,
        sender: "user",
        text: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read"
      }
    ]);

    // Process agent output with simulated timing delay
    processAgentResponse(userText);
  };

  // Handlers for simulator shortcuts
  const selectQuickQuestion = (question: string) => {
    if (isTyping) return;
    setChatMessages(prev => [
      ...prev,
      {
        id: `m-user-quick-${Date.now()}`,
        sender: "user",
        text: question,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read"
      }
    ]);
    processAgentResponse(question);
  };

  // Helper code for generating a WhatsApp redirection link for real-world sandbox testing
  const pairingCodeUuid = "OCTA-WA-PAIR-60170-A672";
  const realWhatsAppJoinUrl = `https://wa.me/5585996898895?text=Ola%2C%20gostaria%20de%20integrar%20o%20sistema%20da%20minha%20empresa%20e%20ativar%20o%20suporte%20comercial%20da%20OCTA%20ENERGIA.%20Chave%3A%20${pairingCodeUuid}`;

  // Clear Chat History
  const clearChat = () => {
    setChatMessages([
      {
        id: "m-init-1",
        sender: "agent",
        text: "Olá! Seja bem-vindo ao suporte comercial inteligente da *OCTA ENERGIA*. ⚡\n\nEu sou o *OCTA Advancer*, assistente virtual autônomo de atendimento. Como posso otimizar a matriz energética da sua empresa hoje?\n\nDigite sua dúvida ou escolha uma das simulações rápidas abaixo!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read"
      }
    ]);
    addLog("system", "Histórico do chat simulador redefinido.");
  };

  return (
    <section id="whatsapp-ia" className="py-24 relative overflow-hidden z-20 bg-slate-950/25 border-y border-white/5">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-12 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest mb-4">
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            <span>Plataforma de IA Agêntica</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Integração WhatsApp & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Agente IA Autônomo</span>
          </h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed font-sans">
            Migue seu atendimento, captação de leads e geração de propostas técnicas diretamente para o WhatsApp de forma 100% autônoma. Conecte seu dispositivo instantaneamente e monitore a tomada de ações inteligentes da IA.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column Left (5 Cols) - Connection Status & Prompt Configuration */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* 1. Connection Card (QR Code pairing) */}
            <div className="bg-[#0b0f19] border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-xl" id="pairing-panel-wrapper">
              <h3 className="font-sans font-bold text-base text-white flex items-center gap-2 mb-4">
                <QrCode className="w-5 h-5 text-emerald-400" />
                Pareamento de Conta WhatsApp
              </h3>

              <div className="flex flex-col md:flex-row items-center gap-6">
                
                {/* QR Code Graphic Frame */}
                <div className="relative flex-shrink-0 bg-white p-3.5 rounded-2xl shadow-inner shadow-black/40">
                  {connectionStatus === "disconnected" && (
                    <div className="relative">
                      {/* Real dynamic image from free premium QR server */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(realWhatsAppJoinUrl)}&color=0b0f19`}
                        alt="WhatsApp pairing QR code"
                        className="w-[140px] h-[140px] select-none block"
                      />
                      {/* Inner QR Overlay Decoration */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-white p-1 rounded-lg shadow-md border border-slate-100">
                          <svg className="w-6 h-6 text-[#25D366] fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.717-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 1.981 14.117.957 11.53.957c-5.44 0-9.866 4.372-9.87 9.802 0 1.972.523 3.902 1.513 5.61l-.997 3.642 3.771-.979a9.88 9.88 0 0 0 4.11 1.002z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {connectionStatus === "pairing" && (
                    <div className="w-[140px] h-[140px] flex flex-col items-center justify-center bg-slate-900 border border-emerald-500/20 rounded-xl">
                      <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                      <span className="text-[10px] font-mono text-emerald-400 tracking-wider font-bold">
                        {pairingProgress}% LENDO...
                      </span>
                    </div>
                  )}

                  {connectionStatus === "connected" && (
                    <div className="w-[140px] h-[140px] flex flex-col items-center justify-center bg-slate-900/45 border border-emerald-500/30 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>
                      <CheckCheck className="w-10 h-10 text-emerald-400 relative z-10" />
                      <span className="text-[10px] font-mono font-bold text-emerald-400 tracking-wider mt-2 relative z-10 uppercase">
                        PAREADO OK
                      </span>
                    </div>
                  )}
                </div>

                {/* Connection Controls & Specs */}
                <div className="flex-1 w-full text-slate-300 select-none">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                      connectionStatus === "connected" ? "bg-emerald-500 animate-pulse" :
                      connectionStatus === "pairing" ? "bg-amber-500 animate-pulse" : "bg-red-500"
                    }`}></span>
                    <span className="font-mono text-xs uppercase font-bold tracking-wider">
                      {connectionStatus === "connected" ? "Status: Conectado" :
                       connectionStatus === "pairing" ? "Status: Pareando..." : "Status: Desconectado"}
                    </span>
                  </div>

                  {connectionStatus === "disconnected" && (
                    <>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        Abra o WhatsApp no seu smartphone, vá em 
                        <strong> Aparelhos Conectados &gt; Conectar um Aparelho</strong>, e escaneie o código QR acima ou utilize o sincronizador.
                      </p>
                      <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                        <button
                          onClick={startPairing}
                          id="btn-trigger-pairing"
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          Parear Simulador
                        </button>
                        <a
                          href={realWhatsAppJoinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          id="btn-trigger-real-whatsapp"
                          className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5 text-center"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Iniciar no WhatsApp Real
                        </a>
                      </div>
                    </>
                  )}

                  {connectionStatus === "pairing" && (
                    <div className="w-full">
                      <p className="text-xs text-slate-300 mb-2 font-mono">Realizando checagem biométrica de chaves criptográficas...</p>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-400 h-full transition-all duration-300 rounded-full" 
                          style={{ width: `${pairingProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {connectionStatus === "connected" && (
                    <div className="text-slate-300 font-sans">
                      <div className="space-y-1.5 text-xs text-slate-400">
                        <p>👤 <strong>Canal:</strong> <span className="text-white">{activeSession.sessionName}</span></p>
                        <p>📞 <strong>Número:</strong> <span className="text-white">{activeSession.phoneNumber}</span></p>
                        <p>💻 <strong>Servidor:</strong> <span className="text-white">{activeSession.deviceName}</span></p>
                        <p>🕒 <strong>Vinculado:</strong> <span className="text-emerald-400">{activeSession.scannedAt}</span></p>
                      </div>
                      <button
                        onClick={disconnectSession}
                        id="btn-disconnect-pairing"
                        className="mt-4 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-slate-300 transition-all flex items-center justify-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        Desconectar Dispositivo
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* 2. Configure Agent Profile Card */}
            <div className="bg-[#0b0f19] border border-white/10 rounded-3xl p-6 flex-1 flex flex-col">
              <h3 className="font-sans font-bold text-base text-white flex items-center gap-2 mb-4">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Parâmetros Cognitivos do Agente AI
              </h3>

              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Agent Personality Preset Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Personalidade e Escopo Técnico:</label>
                  <select
                    value={agentPersonality}
                    onChange={(e) => handlePersonalityChange(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs font-medium text-slate-200 outline-none focus:border-emerald-500"
                  >
                    <option value="consultor_comercial">Consultor Técnico-Comercial B2B (Padrão)</option>
                    <option value="engenheiro_tecnico">Engenheiro Projetista de Base Load</option>
                    <option value="fechador_b2b">Diretoria de Governança & Contratos (Leasing)</option>
                  </select>
                </div>

                {/* System Prompt Customization */}
                <div className="flex-1 flex flex-col mt-2">
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Instrução de Sistema (System Prompt):</label>
                  <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    className="w-full flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-[11px] font-mono text-slate-300 leading-normal outline-none focus:border-emerald-500 resize-none min-h-[140px]"
                    placeholder="Instruções de comportamento da IA..."
                  />
                </div>

                {/* Toggles for autonomous tool actions */}
                <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase block">Ações e Ferramentas Intelectuais (Agentic Tools):</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-white/5 hover:border-emerald-500/20 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={allowedTools.calcViability} 
                        onChange={(e) => setAllowedTools(prev => ({ ...prev, calcViability: e.target.checked }))}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0 focus:ring-offset-0" 
                      />
                      <span className="text-slate-300 font-medium">Math Viability Engine</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-white/5 hover:border-emerald-500/20 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={allowedTools.pdfProposal} 
                        onChange={(e) => setAllowedTools(prev => ({ ...prev, pdfProposal: e.target.checked }))}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0" 
                      />
                      <span className="text-slate-300 font-medium">Gerador PDF de Propostas</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-white/5 hover:border-emerald-500/20 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={allowedTools.dispatchLead} 
                        onChange={(e) => setAllowedTools(prev => ({ ...prev, dispatchLead: e.target.checked }))}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0" 
                      />
                      <span className="text-slate-300 font-medium">Alerta de Lead Comercial</span>
                    </label>

                    <label className="flex items-center gap-2 px-3 py-2 bg-slate-950 rounded-xl border border-white/5 hover:border-emerald-500/20 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={allowedTools.scheduleMeeting} 
                        onChange={(e) => setAllowedTools(prev => ({ ...prev, scheduleMeeting: e.target.checked }))}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0" 
                      />
                      <span className="text-slate-300 font-medium">Agendar Reunião Técnica</span>
                    </label>
                  </div>
                </div>

                {/* Temp and Delay Sliders */}
                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-white/5">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                      <span>Criatividade (Temp):</span>
                      <span className="text-emerald-400 text-xs font-mono">{aiTemperature}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1" 
                      value={aiTemperature} 
                      onChange={(e) => setAiTemperature(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-950 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                      <span>Tempo de Escrita (Delay):</span>
                      <span className="text-emerald-400 text-xs font-mono">{autoResponseDelay}s</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.0" 
                      max="5.0" 
                      step="0.5" 
                      value={autoResponseDelay} 
                      onChange={(e) => setAutoResponseDelay(parseFloat(e.target.value))}
                      className="w-full accent-emerald-400 bg-slate-950 cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Column Right (7 Cols) - WhatsApp UI Simulator and Live Agent Log Monitor */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Split layout: Smartphone frame and side agent logger */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1">
              
              {/* WhatsApp UI Mock (7 cols of right side or full) */}
              <div className="md:col-span-7 bg-[#0b0c10] border border-white/10 rounded-3xl flex flex-col overflow-hidden relative shadow-2xl h-[560px]" id="whatsapp-simulator-frame">
                
                {/* Simulated Phone Top Header */}
                <div className="bg-[#128c7e] md:bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-400/25 flex items-center justify-center font-bold text-emerald-300 relative">
                      <Bot className="w-5 h-5 text-emerald-400" />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                    </div>
                    <div>
                      <div className="font-bold text-sm tracking-tight">{agentName}</div>
                      <div className="text-[10px] text-emerald-200/90 font-medium flex items-center gap-1">
                        {isTyping ? (
                          <span className="animate-pulse tracking-wide font-bold">digitando...</span>
                        ) : (
                          <>
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            <span>online (agente IA ativo)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={clearChat}
                      className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Redefinir Conversa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Simulated WhatsApp Wallpaper and chat body */}
                <div 
                  className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#0d141b] relative flex flex-col scroll-smooth"
                  style={{
                    backgroundImage: "radial-gradient(#1e2c3a 0.5px, transparent 0.5px)",
                    backgroundSize: "16px 16px"
                  }}
                >
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[85%] ${
                        msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                      }`}
                    >
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow ${
                        msg.sender === "user" 
                          ? "bg-[#0b141a] border border-[#25D366]/20 text-[#e9edef] rounded-tr-none" 
                          : "bg-[#202c33] text-[#e9edef] rounded-tl-none border border-slate-800/10"
                      }`}>
                        {msg.text}

                        {/* Tool execution tag in chat if requested */}
                        {msg.isToolResponse && msg.toolUsed && (
                          <div className="mt-2.5 pt-2.5 border-t border-slate-700/30 flex items-center gap-1.5 text-[9.5px] font-mono text-emerald-400 uppercase font-bold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Ferramenta Utilizada: {msg.toolUsed}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Message metadata */}
                      <div className="flex items-center gap-1.5 mt-1 text-[9.5px] text-slate-500 font-mono">
                        <span>{msg.timestamp}</span>
                        {msg.sender === "user" && (
                          <span className="text-[#53bdeb]">
                            <CheckCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="self-start items-start max-w-[85%] flex flex-col">
                      <div className="bg-[#202c33] text-[#e9edef] px-4 py-3 rounded-2xl rounded-tl-none border border-slate-800/10 flex items-center gap-1.5 text-xs">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef}></div>
                </div>

                {/* Simulated Quick Selection Question Chips (Scrollable list at bottom of chat) */}
                <div className="bg-[#111b21] border-t border-white/5 px-2.5 py-2 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                  <button 
                    disabled={isTyping}
                    onClick={() => selectQuickQuestion("Quais são as potências dos geradores disponíveis?")} 
                    className="inline-block bg-[#202c33] hover:bg-[#202c33]/80 text-white text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors border border-white/5 active:scale-95 disabled:opacity-50"
                  >
                    ⚡ Modelos Disponíveis
                  </button>
                  <button 
                    disabled={isTyping}
                    onClick={() => selectQuickQuestion("Como funciona a tecnologia GAEL dos rotores?")} 
                    className="inline-block bg-[#202c33] hover:bg-[#202c33]/80 text-white text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors border border-white/5 active:scale-95 disabled:opacity-50"
                  >
                    ⚙ Como funciona a GAEL?
                  </button>
                  <button 
                    disabled={isTyping}
                    onClick={() => selectQuickQuestion("Quero simular um projeto de 500kW e ver a economia")} 
                    className="inline-block bg-[#202c33] hover:bg-[#202c33]/80 text-white text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors border border-white/5 active:scale-95 disabled:opacity-50"
                  >
                    📈 Simular viabilidade (500kW)
                  </button>
                  <button 
                    disabled={isTyping}
                    onClick={() => selectQuickQuestion("Quais as condições de faturamento de aquisição?")} 
                    className="inline-block bg-[#202c33] hover:bg-[#202c33]/80 text-white text-[10px] px-3 py-1.5 rounded-full font-medium transition-colors border border-white/5 active:scale-95 disabled:opacity-50"
                  >
                    💳 Sinal e Faturamento
                  </button>
                </div>

                {/* Message Input Bar */}
                <form 
                  onSubmit={handleUserSendMessage}
                  className="bg-[#1f2c34] px-3 py-2.5 flex items-center gap-2 border-t border-slate-700/35 relative z-10"
                >
                  <input
                    type="text"
                    value={userInputValue}
                    onChange={(e) => setUserInputValue(e.target.value)}
                    placeholder="Digite sua mensagem corporativa..."
                    className="flex-1 bg-[#2a3942] border border-none rounded-xl px-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none"
                    disabled={connectionStatus !== "connected" || isTyping}
                  />
                  <button
                    type="submit"
                    disabled={!userInputValue.trim() || connectionStatus !== "connected" || isTyping}
                    className="w-9 h-9 rounded-full bg-[#00a884] hover:bg-[#009675] disabled:bg-[#2a3942] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4 text-white fill-current" />
                  </button>
                </form>

                {connectionStatus !== "connected" && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                    <Phone className="w-10 h-10 text-emerald-400 animate-pulse mb-3" />
                    <h4 className="font-sans font-bold text-sm text-white mb-1">Pareamento Obrigatório</h4>
                    <p className="text-xs text-slate-400 max-w-[220px] leading-relaxed">
                      Conecte sua conta do WhatsApp pressionando o botão <strong>"Parear Simulador"</strong> sob o QR Code para ativar o chat do agente de IA.
                    </p>
                  </div>
                )}

              </div>

              {/* Monospace Tech Terminal Live Logs (5 cols of right side) */}
              <div className="md:col-span-5 bg-black border border-white/10 rounded-3xl p-4 flex flex-col overflow-hidden h-[560px]">
                
                {/* Logger Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400 rotate-90" />
                    <div className="font-mono text-xs font-bold text-white tracking-widest uppercase">Console do Agente</div>
                  </div>
                  <span className="inline-flex w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                </div>

                {/* Log Event Feed */}
                <div className="flex-1 overflow-y-auto space-y-2.5 font-mono text-[9px] sm:text-[10px] leading-relaxed text-slate-400 scroll-smooth">
                  {logs.map((log) => (
                    <div key={log.id} className="border-b border-white/5 pb-1.5 last:border-none">
                      <div className="flex items-center justify-between text-slate-500 font-bold mb-0.5">
                        <span className="text-slate-600">[{log.timestamp}]</span>
                        <span className={`px-1 rounded text-[8px] uppercase ${
                          log.type === "system" ? "bg-slate-800 text-slate-300" :
                          log.type === "incoming" ? "bg-amber-500/10 text-amber-400" :
                          log.type === "agent-thought" ? "bg-purple-500/10 text-purple-400" :
                          log.type === "tool" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {log.type}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap select-text text-slate-300">{log.text}</p>
                    </div>
                  ))}
                  <div ref={logsEndRef}></div>
                </div>

                {/* Clear console logs action */}
                <button
                  onClick={() => {
                    setLogs([
                      {
                        id: "l-init-clear",
                        timestamp: new Date().toLocaleTimeString(),
                        type: "system",
                        text: "Console limpo pelo desenvolvedor. Iniciando escuta de webhooks ativos..."
                      }
                    ]);
                  }}
                  className="mt-3 text-[9px] select-none text-slate-500 hover:text-slate-300 transition-colors uppercase font-mono tracking-wider text-right block self-end"
                >
                  [_] Limpar Console
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
