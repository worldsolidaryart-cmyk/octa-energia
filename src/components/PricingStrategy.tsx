import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DollarSign, 
  Percent, 
  HelpCircle, 
  Coins, 
  Calendar, 
  RotateCcw, 
  ShieldAlert, 
  Briefcase, 
  Check, 
  Scale, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  Info,
  TrendingUp,
  Award
} from "lucide-react";

interface PricingItem {
  power: string;
  value: number;
  commissionRate: number;
  commissionValue: number;
}

export default function PricingStrategy() {
  const [activeTab, setActiveTab] = useState<"venda" | "locacao">("venda");
  const [searchPower, setSearchPower] = useState("");
  const [selectedPowerId, setSelectedPowerId] = useState<string>("300 KVA");
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  // Vendas pricing list based on the user's spreadsheet rules
  const salesPricing: PricingItem[] = [
    { power: "15 KVA", value: 520000, commissionRate: 6, commissionValue: 31200 },
    { power: "30 KVA", value: 780000, commissionRate: 6, commissionValue: 46800 },
    { power: "50 KVA", value: 1080000, commissionRate: 6, commissionValue: 64800 },
    { power: "100 KVA", value: 1720000, commissionRate: 6, commissionValue: 103200 },
    { power: "200 KVA", value: 1950000, commissionRate: 6, commissionValue: 117000 },
    { power: "250 KVA", value: 2400000, commissionRate: 6, commissionValue: 144000 },
    { power: "300 KVA", value: 2800000, commissionRate: 6, commissionValue: 168000 },
    { power: "350 KVA", value: 3000000, commissionRate: 6, commissionValue: 180000 },
    { power: "400 KVA", value: 3100000, commissionRate: 6, commissionValue: 186000 },
    { power: "450 KVA", value: 3200000, commissionRate: 6, commissionValue: 192000 },
    { power: "500 KVA", value: 3400000, commissionRate: 6, commissionValue: 204000 },
  ];

  // Locação pricing list based on the user's spreadsheet rules
  const leasingPricing: PricingItem[] = [
    { power: "15 KVA", value: 260000, commissionRate: 6, commissionValue: 15600 },
    { power: "30 KVA", value: 390000, commissionRate: 6, commissionValue: 23400 },
    { power: "50 KVA", value: 540000, commissionRate: 6, commissionValue: 32400 },
    { power: "100 KVA", value: 860000, commissionRate: 6, commissionValue: 51600 },
    { power: "200 KVA", value: 975000, commissionRate: 6, commissionValue: 58500 },
    { power: "250 KVA", value: 1200000, commissionRate: 6, commissionValue: 72000 },
    { power: "300 KVA", value: 1400000, commissionRate: 6, commissionValue: 84000 },
    { power: "350 KVA", value: 1500000, commissionRate: 6, commissionValue: 90000 },
    { power: "400 KVA", value: 1550000, commissionRate: 6, commissionValue: 93000 },
    { power: "450 KVA", value: 1600000, commissionRate: 6, commissionValue: 96000 },
    { power: "500 KVA", value: 1700000, commissionRate: 6, commissionValue: 102000 },
  ];

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const getActiveList = () => {
    return activeTab === "venda" ? salesPricing : leasingPricing;
  };

  const filteredPricing = getActiveList().filter(item => 
    item.power.toLowerCase().includes(searchPower.toLowerCase())
  );

  const selectedItem = getActiveList().find(item => item.power === selectedPowerId) || getActiveList()[6];

  const strategyDirectives = [
    {
      title: "Consórcio de Fabricação & Pagamento Facilitado",
      icon: <Coins className="w-5 h-5 text-[#f2ff00]" />,
      desc: "O cliente se disporá de 50% do valor total para fabricação dos componentes e início da produção eletromecânica no ato do pedido, e o saldo restante de 50% será liquidado no ato da entrega e inicialização operacional do equipamento."
    },
    {
      title: "Carência & Desconto Concessionária",
      icon: <Calendar className="w-5 h-5 text-[#f2ff00]" />,
      desc: "Inclusão de cláusula com meses bônus de carência operacional. Após amortização primária do capital, o cliente pagará taxa correspondente a apenas 50% da última conta de fatura apresentada no mês de instalação da tecnologia."
    },
    {
      title: "Contratos de Locação em Cláusula Longa (ESCO)",
      icon: <Briefcase className="w-5 h-5 text-[#f2ff00]" />,
      desc: "O contrato possui vigência institucional e técnica mínima obrigatória de 5 anos ou 60 meses. Ele é renovável de forma contínua a pedido do cliente mediante comunicado formal de engenharia efetuado com no mínimo 90 dias de antecedência."
    },
    {
      title: "Reajustes Federais & Bonificações",
      icon: <TrendingUp className="w-5 h-5 text-[#f2ff00]" />,
      desc: "Nas renovações, os reajustes de tarifa serão calculados e indexados de acordo com os reajustes de energia aplicados pelo Governo Federal ano a ano nos últimos 60 meses, acrescidos de uma bonificação progressiva de 30% da soma destes reajustes."
    },
    {
      title: "Cláusula Eletromecânica de Retorno/Devolução",
      icon: <RotateCcw className="w-5 h-5 text-[#f2ff00]" />,
      desc: "Caso o cliente corporativo queira voluntariamente devolver o conjunto magnético dentro do prazo obrigatório (a partir de 30 até 60 meses), será estornado o correspondente a 30% do valor total do custo nominal de fabricação industrial."
    },
    {
      title: "Garantia de Preço & Variações Internacionais",
      icon: <ShieldAlert className="w-5 h-5 text-[#f2ff00]" />,
      desc: "A OCTA ENERGIA se reserva o direito de ajustar as programações de valores acima de acordo com intempéries comerciais, incluindo flutuação cambial ou variações na aquisição de insumos de Neodímio e peças especiais que compõem o equipamento."
    }
  ];

  return (
    <section id="faturamento" className="py-24 relative overflow-hidden z-20 bg-slate-900/40 border-y border-white/5 font-sans" style={{ scrollMarginTop: "80px" }}>
      {/* Decorative vectors */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#f2ff00]/5 blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#f2ff00]/10 border border-[#f2ff00]/25 rounded-full text-xs font-mono font-bold text-[#f2ff00] uppercase tracking-widest mb-4">
            <Coins className="w-4 h-4" />
            <span>Políticas de Comercialização</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
            Tabela de Preços e <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2ff00] to-cyan-300">Estratégia de Comissões</span>
          </h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-2xl mx-auto">
            Consulte os parâmetros corporativos oficiais para aquisição direta ou locação operacional (ESCO) dos geradores magnéticos cinéticos. Transparência regulatória e alto retorno comercial B2B.
          </p>
        </div>

        {/* Outer Frame with Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tab Selection and Interactive Price Board */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Control Panel: Option tabs and search input */}
            <div className="bg-slate-950/65 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Tab Selector */}
              <div className="flex bg-slate-900 border border-white/5 rounded-xl p-1 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab("venda");
                    setSearchPower("");
                  }}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === "venda"
                      ? "bg-[#f2ff00] text-slate-950 shadow-md shadow-[#f2ff00]/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Aquisição (Venda)
                </button>
                <button
                  onClick={() => {
                    setActiveTab("locacao");
                    setSearchPower("");
                  }}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === "locacao"
                      ? "bg-[#f2ff00] text-slate-950 shadow-md shadow-[#f2ff00]/10"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Locação (ESCO)
                </button>
              </div>

              {/* Filter */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filtrar por potência... Ex: 300 KVA"
                  value={searchPower}
                  onChange={(e) => setSearchPower(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#f2ff00] transition-colors"
                />
              </div>
            </div>

            {/* Price Table Viewport */}
            <div className="bg-slate-950/90 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
                    {activeTab === "venda" ? "Tabela de Vendas de Ativos Ecológicos" : "Tabela para Comercialização - Locação"}
                  </h3>
                  <p className="text-[10px] uppercase font-mono font-bold text-slate-500 mt-1">
                    Comissão unificada em 6.00% para parceiros & consultores
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                  Regulamentado
                </span>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-900/60 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-6 font-bold">Potência (KVA)</th>
                      <th className="py-4 px-6 font-bold">Valor Oficial (R$)</th>
                      <th className="py-4 px-6 text-center font-bold">Comissão %</th>
                      <th className="py-4 px-6 text-right font-bold">Valor da Comissão (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                    {filteredPricing.length > 0 ? (
                      filteredPricing.map((item) => (
                        <tr 
                          key={item.power}
                          onClick={() => setSelectedPowerId(item.power)}
                          className={`hover:bg-white/[0.04] transition-colors cursor-pointer select-none ${
                            selectedPowerId === item.power ? "bg-[#f2ff00]/5 text-white" : ""
                          }`}
                        >
                          <td className="py-3.5 px-6 font-semibold flex items-center gap-2">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                              selectedPowerId === item.power ? "bg-[#f2ff00]" : "bg-slate-600"
                            }`}></span>
                            {item.power}
                          </td>
                          <td className="py-3.5 px-6 font-mono font-medium">
                            {formatBRL(item.value)}
                          </td>
                          <td className="py-3.5 px-6 text-center font-mono text-slate-400 font-bold">
                            {item.commissionRate}%
                          </td>
                          <td className="py-3.5 px-6 text-right font-mono font-bold text-emerald-400">
                            {formatBRL(item.commissionValue)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-500 text-xs font-mono">
                          Nenhum modelo de gerador encontrado para esta potência.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Warning tag */}
              <div className="p-4 bg-slate-900/50 border-t border-white/5 text-[10px] text-slate-400 leading-relaxed font-sans">
                💡 <strong>Dica de Uso:</strong> Clique sobre qualquer uma das linhas da tabela de preços acima para projetar o comissionamento detalhado e as condições financeiras de apoio às negociações de engenharia e modelagem legal B2B.
              </div>
            </div>

          </div>

          {/* RIGHT: Selected Pricing Info Box & Strategic Directives Accordion */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Detail Overview Card */}
            <div className="bg-[#0b0f19] border border-[#f2ff00]/15 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f2ff00]/[0.02] rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-black">Dimensionamento Ativo</span>
                  <p className="font-display font-black text-2xl text-white mt-1">{selectedItem.power}</p>
                </div>
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Valor Líquido do Equipamento</span>
                  <span className="text-lg font-mono font-black text-white mt-1 block">
                    {formatBRL(selectedItem.value)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Comissão Base</span>
                    <span className="text-sm font-mono font-black text-[#f2ff00] mt-1 block flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-[#f2ff00]" />
                      {selectedItem.commissionRate}%
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Comissão Estimada</span>
                    <span className="text-sm font-mono font-black text-emerald-400 mt-1 block">
                      {formatBRL(selectedItem.commissionValue)}
                    </span>
                  </div>
                </div>

                {/* Simulated Fabrication Split details */}
                <div className="bg-slate-900/55 p-4 rounded-2xl border border-white/5 font-sans space-y-2.5 shadow-inner">
                  <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-[#f2ff00]" />
                    Fluxo de Desembolso Estimado:
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wide">Ato do Pedido (50%):</p>
                      <p className="font-mono font-black text-white mt-0.5">{formatBRL(selectedItem.value * 0.5)}</p>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Disparar fabricação física</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wide">Entrega Técnica (50%):</p>
                      <p className="font-mono font-black text-white mt-0.5">{formatBRL(selectedItem.value * 0.5)}</p>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Ativação local & start</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Guidelines & Guidelines Header */}
            <div>
              <h3 className="font-sans font-bold text-xs text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#f2ff00]" />
                Diretrizes e Contrato Comercial
              </h3>

              {/* Strategy Accordion List */}
              <div className="space-y-3">
                {strategyDirectives.map((strat, idx) => (
                  <div 
                    key={idx}
                    className="bg-slate-950/65 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/15"
                  >
                    <button
                      onClick={() => setExpandedTip(expandedTip === idx ? null : idx)}
                      className="w-full text-left p-4 flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0">
                          {strat.icon}
                        </div>
                        <span className="font-sans font-bold text-xs text-white leading-normal pr-2">
                          {strat.title}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                        expandedTip === idx ? "rotate-180" : ""
                      }`} />
                    </button>

                    <AnimatePresence>
                      {expandedTip === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-white/5 font-sans">
                            {strat.desc}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
