import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Cpu, 
  Layers, 
  Infinity as InfinityIcon, 
  Database, 
  Leaf, 
  RefreshCw, 
  TrendingUp, 
  Coins, 
  Wrench, 
  ShieldCheck, 
  Activity, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  Download, 
  Calculator as CalcIcon, 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle,
  Menu,
  X,
  Gauge,
  Lightbulb,
  Building,
  Sprout,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { companyName, originalName, generatorsData, financialPremises, aboutCompanyText, marketChallenges } from "./data";
import { GeneratorModel } from "./types";
import { generateFinancialPDF, generateCatalogPDF } from "./utils/pdfGenerator";
import EcoBanner from "./components/EcoBanner";
import { GoogleTranslate } from "./components/GoogleTranslate";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  // Navigation states
  const [activeSection, setActiveSection] = useState("inicio");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Loading states for PDF / Proposal buttons
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingModalPDF, setIsGeneratingModalPDF] = useState(false);

  // Catalog filtering states
  const [selectedFilter, setSelectedFilter] = useState<"all" | "small" | "medium" | "large">("all");

  // Selected model for Ficha Técnica modal
  const [selectedModel, setSelectedModel] = useState<GeneratorModel | null>(null);

  // Multi-unit interactive simulator states
  const [simulatorPower, setSimulatorPower] = useState<number>(300); // 300 kW default
  const [simulatorTariff, setSimulatorTariff] = useState<number>(1.14); // R$ 1.14 default
  const [simulatorUptime, setSimulatorUptime] = useState<number>(90); // 90% default

  // Strategy and selection states
  const [simulatorMode, setSimulatorMode] = useState<"venda" | "locacao">("venda"); // venda vs locacao (ESCO)
  const [simulatorInputType, setSimulatorInputType] = useState<"consumo" | "conta">("consumo"); // consumo vs conta
  const [simulatorEscoDiscount, setSimulatorEscoDiscount] = useState<number>(20); // discount percent for ESCO, e.g. 20%
  const [manualConsumption, setManualConsumption] = useState<number>(194400); // default
  const [manualBill, setManualBill] = useState<number>(221616); // default
  const [isOffGrid, setIsOffGrid] = useState<boolean>(false); // Projects with no grid / distant grid + BESS

  // Proposal modal control states
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [proposalCustomerName, setProposalCustomerName] = useState("");
  const [proposalCustomerCompany, setProposalCustomerCompany] = useState("");
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // Sync effect to keep manual inputs initialized or synchronized with nominal slider generator values
  useEffect(() => {
    const nominalKwh = Math.round(simulatorPower * 24 * 30 * (simulatorUptime / 100));
    setManualConsumption(nominalKwh);
    setManualBill(Math.round(nominalKwh * simulatorTariff));
  }, [simulatorPower, simulatorUptime, simulatorTariff]);

  const handleConsumptionChange = (val: number) => {
    const cleanVal = Math.max(0, val);
    setManualConsumption(cleanVal);
    setManualBill(Math.round(cleanVal * simulatorTariff));
    const uptimeFactor = simulatorUptime / 100;
    const calculatedPower = cleanVal / (24 * 30 * uptimeFactor);
    const clampedPower = Math.max(15, Math.min(1000, Math.round(calculatedPower / 5) * 5));
    setSimulatorPower(clampedPower);
  };

  const handleBillChange = (val: number) => {
    const cleanVal = Math.max(0, val);
    setManualBill(cleanVal);
    const consumption = simulatorTariff > 0 ? Math.round(cleanVal / simulatorTariff) : 0;
    setManualConsumption(consumption);
    const uptimeFactor = simulatorUptime / 100;
    const calculatedPower = consumption / (24 * 30 * uptimeFactor);
    const clampedPower = Math.max(15, Math.min(1000, Math.round(calculatedPower / 5) * 5));
    setSimulatorPower(clampedPower);
  };

  // Find suggested/calculated generator by finding closest power rating matches
  const suggestedGenerator = generatorsData.reduce((prev, curr) => {
    return Math.abs(curr.powerKw - simulatorPower) < Math.abs(prev.powerKw - simulatorPower) ? curr : prev;
  });

  // Lead capture form states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    interestPower: "100",
    currentBill: "",
    notes: "Gostaria de agendar reunião para avaliar a implantação comercial de um gerador OCTA 15 Carenado em nosso site."
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Monitor scroll to update active nav link
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["inicio", "quem-somos", "tecnologia", "produtos", "viabilidade", "faturamento", "whatsapp-ia"];
      const scrollPosition = window.scrollY + 120;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter generator data
  const filteredGenerators = generatorsData.filter(gen => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "small") return gen.powerKw <= 100;
    if (selectedFilter === "medium") return gen.powerKw > 100 && gen.powerKw <= 300;
    if (selectedFilter === "large") return gen.powerKw > 300;
    return true;
  });

  // Calculate simulated values
  // Generation_mês = PowerKw * 24 hours * 30 days * Factor
  // Saving_mês:
  // - For locacao: Based on concessional discount over the selected energy bill
  // - For venda: Up to 100% of nominal energy generated at the company tariff
  const simulatedMonthlyKwh = Math.round(simulatorPower * 24 * 30 * (simulatorUptime / 100));
  
  const simulatedMonthlySavings = simulatorMode === "locacao"
    ? Math.round(manualBill * (simulatorEscoDiscount / 100))
    : Math.round(Math.min(simulatedMonthlyKwh * simulatorTariff, manualBill));

  const simulatedAnnualSavings = Math.round(simulatedMonthlySavings * 12);
  
  // Dynamic Capex calculation based on models and values:
  // 15kVA: R$ 220k | 30kVA: R$ 450k | 50kVA: R$ 750k | 100kVA: R$ 1.25M | 200kVA: R$ 1.65M | 250kVA: R$ 1.9M | 300kVA: R$ 2.3M | 350kVA: R$ 2.6M | 400kVA: R$ 2.95M | 450kVA: R$ 3.25M | 500kVA: R$ 3.5M | 1MW: R$ 6.5M
  const getGeneratorPrice = (power: number) => {
    if (power <= 15) return 220000;
    if (power <= 30) return 450000;
    if (power <= 50) return 750000;
    if (power <= 100) return 1250000;
    if (power <= 150) return 1650000;
    if (power <= 200) return 1650000;
    if (power <= 250) return 1900000;
    if (power <= 300) return 2300000;
    if (power <= 350) return 2600000;
    if (power <= 400) return 2950000;
    if (power <= 450) return 3250000;
    if (power <= 500) return 3500000;
    return 6500000; // 1.0 MW (1000 kW)
  };

  const currentCapex = getGeneratorPrice(simulatorPower);
  const calculatedPayback = simulatedAnnualSavings > 0 ? Math.ceil((currentCapex / simulatedAnnualSavings) * 12) : 18;

  // Payback estimation scales: for Locação it has IMMEDIATE payback value (Capex is zero). Otherwise dynamic.
  const estPaybackMonths = simulatorMode === "locacao" ? 0 : Math.max(6, Math.min(36, calculatedPayback));

  // Trees equivalent planted: 1 kWh of clean energy prevents ~0.4 kg of CO2 compared to standard grid.
  // 1 tree absorbs ~20kg of CO2 per year.
  const treesEquiv = Math.round((simulatedAnnualSavings / (simulatorTariff || 1.14)) * 0.4 / 20);

  // Form handle submit
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const dup = { ...prev };
        delete dup[name];
        return dup;
      });
    }
  };

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nome é obrigatório";
    if (!formData.email.trim()) errors.email = "E-mail é obrigatório";
    if (!formData.phone.trim()) errors.phone = "Telefone é obrigatório";
    if (!formData.company.trim()) errors.company = "Empresa é obrigatória";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      interestPower: "100",
      currentBill: "",
      notes: "Gostaria de agendar reunião para avaliar a implantação comercial de um gerador OCTA 15 Carenado em nosso site."
    });
    setFormSubmitted(false);
  };

  return (
    <div className="relative min-h-screen font-sans antialiased text-slate-100 bg-[#060606] overflow-x-hidden">
      
      {/* BACKGROUND WAVE PATTERNS */}
      <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[100%] rounded-full bg-[#f2ff00]/10 blur-[130px]" />
        <div className="absolute top-[10%] right-[-1%] w-[50%] h-[80%] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#060606]/85 border-b border-white/5 transition-all">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#inicio" className="flex items-center space-x-3 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f2ff00] to-cyan-400 shadow-lg shadow-[#f2ff00]/10 group-hover:scale-105 transition-transform duration-300">
                <InfinityIcon className="w-6 h-6 text-black stroke-[3.0]" />
                <span className="absolute top-[-3px] right-[-3px] flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f2ff00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f2ff00]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black tracking-tight text-white leading-none">
                  OCTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2ff00] to-cyan-300">ENERGIA</span>
                </span>
                <span className="text-[10px] font-medium tracking-normal text-[#f2ff00] mt-1 line-clamp-1">
                  soluções em energia limpa
                </span>
                <span className="text-[8px] font-sans text-slate-400 font-light mt-0.5 uppercase tracking-wider">
                  Grupo VALLEC PARTICIPAÇÕES
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              {[
                { id: "inicio", label: "Início" },
                { id: "quem-somos", label: "Quem Somos" },
                { id: "tecnologia", label: "Tecnologia" },
                { id: "produtos", label: "Geradores Carenados" }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`relative py-2 transition-colors duration-200 hover:text-white ${
                    activeSection === item.id ? "text-[#f2ff00]" : "text-slate-400"
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#f2ff00] to-cyan-400 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              ))}
            </nav>

            {/* CTA Header button */}
            <div className="hidden md:flex items-center space-x-4">
              <div
                style={{
                  position: "absolute",
                  opacity: 0,
                  pointerEvents: "none",
                  width: 1,
                  height: 1,
                  overflow: "hidden",
                  zIndex: -1,
                }}
              >
                <GoogleTranslate />
              </div>
            
              <LanguageSwitcher />
            
              <a
                href="#produtos"
                id="btn-nav-quote"
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-bold text-[#060606] bg-[#f2ff00] hover:bg-[#f2ff00]/90 transition-all duration-200"
              >
                Ver Catálogo
              </a>
            </div>

            {/* Mobile Hamburger menu */}
            <div className="flex md:hidden">
              <button
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                aria-label="Menu principal"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-[#0d0d0d] overflow-hidden"
            >
              <nav className="flex flex-col p-4 space-y-3">
                {[
                  { id: "inicio", label: "Início" },
                  { id: "quem-somos", label: "Quem Somos" },
                  { id: "tecnologia", label: "Tecnologia" },
                  { id: "produtos", label: "Geradores Carenados" }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                      activeSection === item.id 
                        ? "bg-[#f2ff00]/10 text-[#f2ff00]" 
                        : "text-slate-300 hover:bg-[#222]/50 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
                  <a
                    href="#produtos"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-3 rounded-lg text-sm font-bold bg-[#f2ff00] text-[#060606] hover:bg-[#f2ff00]/90 shadow-md shadow-[#f2ff00]/15"
                  >
                    Ver Catálogo
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section id="inicio" className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Texts */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-center lg:text-left z-20">
              <div className="inline-flex items-center justify-center lg:justify-start space-x-2 text-xs font-semibold px-3 py-1.5 self-center lg:self-start rounded-full bg-[#f2ff00]/10 border border-[#f2ff00]/20 text-[#f2ff00] max-w-max">
                <span className="flex h-1.5 w-1.5 rounded-full bg-[#f2ff00] animate-pulse"></span>
                <span>GERANDO UM FUTURO TRANSPARENTE E LIMPO</span>
              </div>
              
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Gerador Magnético <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2ff00] via-yellow-200 to-cyan-300">
                  Cinético de Alta Escala
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Tecnologia nacional inovadora assistida magneticamente por ímãs de Neodímio.
                Geradores robustos com potências de <strong className="text-white">15kW a 1.0MW</strong>.
                Independência de rede e segurança de recarga para frotas industriais, eletropostos urbanos e em autoestradas, agro-indústrias, mineradoras, embarcações.
              </p>

              {/* USP Checklist indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 max-w-xl mx-auto lg:mx-0 text-left text-sm text-slate-300">
                <div className="flex items-center space-x-2.5">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f2ff00]/10 flex items-center justify-center border border-[#f2ff00]/35">
                    <Check className="w-3 h-3 text-[#f2ff00]" />
                  </div>
                  <span>Sem Sol, Vento ou Combustível</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f2ff00]/10 flex items-center justify-center border border-[#f2ff00]/35">
                    <Check className="w-3 h-3 text-[#f2ff00]" />
                  </div>
                  <span>Geração de Base Contínua (24/7)</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f2ff00]/10 flex items-center justify-center border border-[#f2ff00]/35">
                    <Check className="w-3 h-3 text-[#f2ff00]" />
                  </div>
                  <span>Zero Emissões ou Poluição</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f2ff00]/10 flex items-center justify-center border border-[#f2ff00]/35">
                    <Check className="w-3 h-3 text-[#f2ff00]" />
                  </div>
                  <span>Payback Acelerado (6 a 18 meses)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                <a
                  href="#produtos"
                  id="btn-hero-catalog"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-sm font-bold text-black bg-[#f2ff00] hover:bg-[#f2ff00]/90 shadow-lg shadow-[#f2ff00]/10 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Conhecer Modelos 3D
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            {/* Right Interactive Custom Visual Representation of GAEL Core Model  */}
            <div className="lg:col-span-5 flex justify-center items-center relative z-10 lg:pl-4">
              
              {/* Outer decorative orbit ring */}
              <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[#f2ff00]/15 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[440px] h-[440px] rounded-full border border-cyan-500/5" />

              <div className="relative w-[340px] h-[340px] rounded-3xl bg-[#0d0d0d]/90 border border-white/10 shadow-2xl p-6 flex flex-col justify-between overflow-hidden backdrop-blur-xl group">
                {/* Tech aesthetics overlay */}
                <div className="absolute top-0 right-0 p-3 flex space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f2ff00] animate-ping" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f2ff00]" />
                </div>
                <div className="absolute bottom-2 left-4 font-mono text-[9px] text-[#475569]">
                  SYS_CTRL: ONLINE // ROT_SP: 3600_RPM // GAEL_V.03
                </div>

                {/* Card Header */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">CORE_DYNAMICS_MODEL</span>
                  <Badge text="DISRUPTIVO" color="emerald" />
                </div>

                {/* Glowing Core Visual Representation */}
                <div className="my-auto flex flex-col items-center justify-center relative py-6">
                  
                  {/* Energy discharge rings */}
                  <div className="absolute w-52 h-52 bg-gradient-to-tr from-cyan-500/10 to-[#f2ff00]/10 rounded-full blur-2xl animate-pulse" />
                  
                  {/* Outer Spark wires */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-700 via-cyan-400 to-yellow-700 -translate-x-1/2 flex flex-col justify-between items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f2ff00] border border-yellow-600" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f2ff00] border border-yellow-600" />
                  </div>
                  
                  {/* Animated rotating Kinetic Magnetic Core */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="relative w-28 h-28 bg-[#121212] rounded-2xl border-2 border-white/10 shadow-xl flex items-center justify-center p-2 z-10"
                  >
                    {/* Magnetic segment grid lines */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-1">
                      <div className="bg-black/60 rounded border border-white/5 flex items-center justify-center text-[#f2ff00] font-mono font-bold text-[8px]">N</div>
                      <div className="bg-black/60 rounded border border-white/5 flex items-center justify-center text-cyan-400 font-mono text-[8px]">S</div>
                      <div className="bg-black/60 rounded border border-white/5 flex items-center justify-center text-cyan-400 font-mono text-[8px]">S</div>
                      <div className="bg-black/60 rounded border border-white/5 flex items-center justify-center text-[#f2ff00] font-mono font-bold text-[8px]">N</div>
                    </div>

                    {/* Central rotating flux core */}
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-[#f2ff00] to-cyan-400 animate-pulse flex items-center justify-center border border-white/20">
                      <Activity className="w-5 h-5 text-black animate-[spin_2s_linear_infinite]" />
                    </div>
                  </motion.div>

                  {/* Flux Discharge FX */}
                  <div className="absolute flex justify-between w-full px-6 z-0">
                    <span className="w-12 h-1 bg-gradient-to-r from-transparent to-cyan-500/50 rounded animate-[pulse_1.5s_infinite]" />
                    <span className="w-12 h-1 bg-gradient-to-l from-transparent to-[#f2ff00]/50 rounded animate-[pulse_1.5s_infinite]" />
                  </div>

                </div>

                {/* Stats summary bottom */}
                <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex justify-between items-center text-xs">
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px]">Eficiência</span>
                    <span className="font-bold text-white font-mono">97.0%</span>
                  </div>
                  <div className="h-5 w-[1px] bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px]">Perdas Turb.</span>
                    <span className="font-bold text-[#f2ff00] font-mono">~3.0%</span>
                  </div>
                  <div className="h-5 w-[1px] bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-slate-500 text-[10px]">Alimentação</span>
                    <span className="font-bold text-cyan-400 font-mono">Ímãs NdFeB</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* ECO-HUMAN IMPACT BANNER */}
        <EcoBanner />
      </section>

      {/* STATS STRIP */}
      <section className="relative py-12 bg-[#0c0c0c] border-y border-white/5 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {marketChallenges.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-2">
                <span className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-2 font-display bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-500">
                  {stat.value === "Zero" ? "0 (Zero)" : stat.value}
                </span>
                <span className="text-[11px] sm:text-xs text-slate-400 font-medium max-w-[180px]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUEM SOMOS SECTION */}
      <section id="quem-somos" className="py-24 relative overflow-hidden z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual Panel Left */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-sm">
                
                {/* Glowing decor */}
                <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-[#f2ff00]/10 blur-[60px]" />
                <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-cyan-400/10 blur-[60px]" />
                
                {/* Image mockup styled as high-end tech card group */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0d0d0d] to-[#050505] border border-white/10 p-5 flex flex-col space-y-5 shadow-2xl">
                  
                  {/* Clean Product Rendering Box with custom glow */}
                  <div className="rounded-2xl overflow-hidden relative group aspect-[4/3] bg-[#050505] border border-white/5 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
                    
                    <img 
                      src="/src/assets/images/generator_1mw_1781368367812.jpg" 
                      alt="Gerador Comercial OCTA" 
                      referrerPolicy="no-referrer"
                      className="object-contain w-full h-full transform group-hover:scale-102 transition-transform duration-500 drop-shadow-[0_12px_24px_rgba(242,255,0,0.1)]"
                    />
                    
                    <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                      <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">TECNOLOGIA GAEL</span>
                    </div>
                  </div>

                  {/* Small tag checklist */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-[9px] font-mono px-2.5 py-1 rounded-md bg-[#0b0f19] border border-white/5 text-[#94a3b8] tracking-wider uppercase font-semibold">PORTFÓLIO: 100% OFF-GRID</span>
                    <span className="text-[9px] font-mono px-2.5 py-1 rounded-md bg-[#0b0f19] border border-white/5 text-[#94a3b8] tracking-wider uppercase font-semibold">PROPRIEDADE INTELECTUAL</span>
                  </div>

                </div>

              </div>
            </div>

            {/* Description Text Right */}
            <div className="lg:col-span-7 flex flex-col space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full max-w-max">
                <Building className="w-3.5 h-3.5 mr-1" />
                <span>Nossa Origem</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Quem Somos: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2ff00] to-cyan-400">{companyName}</span>
                </h2>
                <span className="text-xs uppercase font-mono tracking-widest text-[#f2ff00]/90 font-bold block">
                  Uma empresa do Grupo VALLEC PARTICIPAÇÕES
                </span>
              </div>

              <p className="text-[#f2ff00] font-medium text-sm sm:text-base leading-relaxed">
                {aboutCompanyText.subtitle}
              </p>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {aboutCompanyText.intro}
              </p>

              <div className="space-y-4">
                {aboutCompanyText.paragraphs.map((desc, idx) => (
                  <p key={idx} className="text-slate-400 text-sm leading-relaxed">
                    {desc}
                  </p>
                ))}
              </div>

              {/* Technologies Pillars Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                {aboutCompanyText.pillars.map((pillar, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-white/10 transition-colors flex flex-col space-y-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#f2ff00]/10 flex items-center justify-center border border-[#f2ff00]/20">
                      {idx === 0 ? <Sprout className="w-4 h-4 text-[#f2ff00]" /> : <InfinityIcon className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <h3 className="font-bold text-white text-sm">{pillar.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ENERGY CHALLENGES SECTION (Slide 2 - Brazilian Market) */}
      <section className="py-20 relative bg-[#0a0a0a] border-y border-white/5 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono text-[#f2ff00] uppercase tracking-widest bg-[#f2ff00]/10 border border-[#f2ff00]/20 px-3 py-1 rounded-full">
              IMPACTO E CONTEXTO DE MERCADO
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
              {marketChallenges.title}
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              {marketChallenges.description}
            </p>
          </div>

          {/* Grid Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketChallenges.points.map((pt, idx) => (
              <div 
                key={idx}
                className="group relative p-6 rounded-2xl bg-[#0d0d0d] border border-white/5 hover:bg-[#121212] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="absolute top-4 right-4 text-3xl font-black font-display text-slate-850 select-none group-hover:text-[#f2ff00]/25 transition-colors">
                  0{idx + 1}
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-white/5">
                    {idx === 0 && <Coins className="w-5 h-5 text-[#f2ff00]" />}
                    {idx === 1 && <Activity className="w-5 h-5 text-yellow-400" />}
                    {idx === 2 && <Clock className="w-5 h-5 text-[#3b82f6]" />}
                    {idx === 3 && <Zap className="w-5 h-5 text-red-400" />}
                  </div>

                  <h3 className="font-bold text-white text-base tracking-tight leading-snug">
                    {pt.title}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="pt-6 font-mono text-[9px] text-[#475569] tracking-wider uppercase group-hover:text-[#f2ff00] transition-colors">
                  Roteamento Inteligente &raquo;
                </div>
              </div>
            ))}
          </div>

          {/* Comparison strip */}
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-yellow-950/10 via-[#0a1824]/20 to-[#0e0e0e] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-[#f2ff00]/10 flex items-center justify-center border border-[#f2ff00]/25 flex-shrink-0">
                <Lightbulb className="w-6 h-6 text-[#f2ff00]" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">O Gerador Magnético Cinético é a Solução de Base</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Garante energia previsível, independente de redes caras ou instáveis. Potência limpa instalada no próprio pátio da sua empresa.
                </p>
              </div>
            </div>
            <a 
              href="#produtos"
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-[#060606] bg-[#f2ff00] hover:bg-[#f2ff00]/90 transition-colors shadow shadow-[#f2ff00]/10 flex-shrink-0"
            >
              Ver Modelos Carenados
            </a>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS / OUR TECHNOLOGY SECTION (Slide 6 & 9) */}
      <section id="tecnologia" className="py-24 relative overflow-hidden z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column Texts */}
            <div className="lg:col-span-6 flex flex-col space-y-6">
              
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 bg-[#f2ff00]/10 border border-[#f2ff00]/20 text-[#f2ff00] rounded-full max-w-max">
                <Cpu className="w-3.5 h-3.5 mr-1 animate-spin" />
                <span>PRINCÍPIO DE FUNCIONAMENTO</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Engenharia Assistida de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2ff00] to-cyan-300">Baixíssimo Desgaste Mecânico</span>
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed">
                Ao contrário dos geradores a combustão convencionais, o sistema **OCTA GAEL** funciona sob o princípio de propensão eletromecânica assistida magneticamente por ímãs permanentes de alta atração de **Neodímio (NdFeB)**.
              </p>

              {/* Progress Flow Steps */}
              <div className="space-y-6 pt-4">
                {[
                  {
                    step: "01",
                    title: "Partida Inicial Auxiliar",
                    desc: "Uma partida momentânea (impulsionada por uma pequena carga da rede ou banco auxiliar de baterias) coloca o sistema rotacional em movimento."
                  },
                  {
                    step: "02",
                    title: "Aceleração Sistêmica & Inércia",
                    desc: "O rotor calibrado de altíssima inércia adquire momento linear. Um arranjo simétrico de imãs otimiza a aceleração."
                  },
                  {
                    step: "03",
                    title: "Estabilização por Campo Magnético",
                    desc: "A atração estruturada cria um torque assistido contínuo, compensando as forças contrárias ao movimento e minimizando o arrasto físico."
                  },
                  {
                    step: "04",
                    title: "Geração Contínua Permanente",
                    desc: "O alternador de bobinagem pura converte o torque cinético em energia elétrica pura (Senoidal Trifásica) com perdas térmicas totais de apenas 3%."
                  }
                ].map((st, i) => (
                  <div key={i} className="flex space-x-4">
                    <span className="flex-shrink-0 font-display text-2xl font-black text-[#f2ff00]/85 bg-[#f2ff00]/5 border border-[#f2ff00]/15 w-12 h-12 rounded-xl flex items-center justify-center">
                      {st.step}
                    </span>
                    <div className="flex flex-col space-y-1">
                      <h4 className="font-bold text-white text-sm">{st.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column Layout: Components & Integration Modules */}
            <div className="lg:col-span-6 flex flex-col space-y-8 lg:pl-6">
              
              {/* Box Components */}
              <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-white flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-cyan-300" />
                  Arquitetura do Gerador & Requisitos (GAEL 300)
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#060606] border border-white/5 flex flex-col space-y-1">
                    <span className="text-[#f2ff00] font-semibold">Instalação Simples</span>
                    <span className="text-slate-300">Base civil básica de concreto (laje industrial), sem ruído excessivo ou vibração severa.</span>
                  </div>
                  
                  <div className="p-3.5 rounded-lg bg-[#060606] border border-white/5 flex flex-col space-y-1">
                    <span className="text-[#f2ff00] font-semibold">Área Ocupada Reduzida</span>
                    <span className="text-slate-300">Layout compacto necessitando de apenas 5 m² a 15 m² de pátio técnico de instalação.</span>
                  </div>
                  
                  <div className="p-3.5 rounded-lg bg-[#060606] border border-white/5 flex flex-col space-y-1">
                    <span className="text-[#f2ff00] font-semibold">Ventilação</span>
                    <span className="text-slate-300">Motor de refrigeração natural, não exige dutos de escape industriais.</span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#060606] border border-white/5 flex flex-col space-y-1">
                    <span className="text-[#f2ff00] font-semibold">Conectividade IoT</span>
                    <span className="text-slate-300">Geração de relatórios de telemetria automáticos integrados via CLP para painéis SCADA.</span>
                  </div>
                </div>
              </div>

              {/* Box Integration Modes */}
              <div className="p-6 rounded-2xl bg-[#0d0d0d] border border-white/10 shadow-xl space-y-4">
                <h3 className="font-display text-lg font-bold text-white flex items-center">
                  <Database className="w-5 h-5 mr-2 text-[#f2ff00]" />
                  Modalidades de Integração
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#060606]/40 transition-colors">
                    <div className="w-2.5 h-2.5 bg-[#f2ff00] rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white block">Operação Off-Grid (Total Autonomia)</strong>
                      <span className="text-slate-400">Geração principal independente, ideal para regiões isoladas, propriedades agrícolas ou corte de rede comercial.</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#060606]/40 transition-colors">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white block">Operação On-Grid (Redução de Fatura/Peak Shaving)</strong>
                      <span className="text-slate-400">Atuação em paralelo com a rede local da concessionária para suavizar consumo e evitar taxas de demanda contratada.</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[#060606]/40 transition-colors">
                    <div className="w-2.5 h-2.5 bg-[#f2ff00]/60 rounded-full mt-1 flex-shrink-0" />
                    <div>
                      <strong className="text-white block">Instalação Híbrida (Gerador + BESS)</strong>
                      <span className="text-slate-400">Integrado a banco de baterias especiais, eliminando quaisquer picos residuais e permitindo backup de resposta milissegunda.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>



      {/* QUADRO COMPARATIVO EXTRAORDINÁRIO COM OUTRAS FONTES ENERGÉTICAS */}
      <section id="comparativo" className="py-24 relative bg-black border-y border-white/5 z-20 artistic-glow-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-white/10 rounded-2xl bg-zinc-900/80 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#f2ff00]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="mb-8">
              <h3 className="font-display font-bold text-white text-xl sm:text-2xl tracking-tight">
                Quadro Comparativo de Viabilidade Energética
              </h3>
              <p className="text-slate-400 text-xs mt-1 max-w-2xl">
                Compare as limitações físicas e operacionais das tecnologias tradicionais de geração de energia com a estabilidade contínua autônoma do Sistema Magnético Cinético da OCTA.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11.5px]">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 uppercase font-mono text-[9px] pb-2">
                    <th className="py-3 px-4">Indicador de Viabilidade</th>
                    <th className="py-3 px-4 bg-emerald-500/5 text-emerald-400 font-bold border-x border-white/5 text-center">Gerador Magnético OCTA</th>
                    <th className="py-3 px-4 text-center">Solar Fotovoltaico</th>
                    <th className="py-3 px-4 text-center">Eólica Industrial</th>
                    <th className="py-3 px-4 text-center">Gerador a Diesel</th>
                    <th className="py-3 px-4 text-center">Rede Concessionária</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Disponibilidade Operacional (Uptime)</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5 border-x border-white/5">98% a 100% (Contínuo)</td>
                    <td className="py-3 px-4 text-center text-slate-400">~25% (Apenas diurno)</td>
                    <td className="py-3 px-4 text-center text-slate-400">~35% (Dependente de vento)</td>
                    <td className="py-3 px-4 text-center text-slate-400">Emergencial (Sob Demanda)</td>
                    <td className="py-3 px-4 text-center text-slate-400">Sujeito a apagões/bandeiras</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Dependência Climática / Geográfica</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5 border-x border-white/5">Zero (Independente)</td>
                    <td className="py-3 px-4 text-center text-rose-400">Alta (Nuvens/Noite)</td>
                    <td className="py-3 px-4 text-center text-rose-400">Alta (Sem vento = Parada)</td>
                    <td className="py-3 px-4 text-center text-slate-400">Zero (Requer combustível)</td>
                    <td className="py-3 px-4 text-center text-slate-400">Baixa (Flutuação de chuvas)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Área de Implantação p/ MW gerado</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5 border-x border-white/5">Ultra compacta (&lt; 20m²)</td>
                    <td className="py-3 px-4 text-center text-rose-400">Extensa (10.000m²+)</td>
                    <td className="py-3 px-4 text-center text-rose-300">Média-Extensa</td>
                    <td className="py-3 px-4 text-center text-slate-400">Compacta (~30m²)</td>
                    <td className="py-3 px-4 text-center text-slate-400">Inexistente no pátio</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Custo de Operação e Combustível</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5 border-x border-white/5">Zero (Magnético Assistido)</td>
                    <td className="py-3 px-4 text-center text-emerald-400">Zero</td>
                    <td className="py-3 px-4 text-center text-emerald-400">Zero</td>
                    <td className="py-3 px-4 text-center text-rose-400">Crítico (Combustão contínua)</td>
                    <td className="py-3 px-4 text-center text-rose-400">Tarifação + Demanda Contratada</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Pegada de Carbono (ESG)</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5 border-x border-white/5">Absoluto Zero Emissões</td>
                    <td className="py-3 px-4 text-center text-emerald-400">Zero na geração</td>
                    <td className="py-3 px-4 text-center text-emerald-400">Zero na geração</td>
                    <td className="py-3 px-4 text-center text-rose-500">Altíssima (Poluição direta)</td>
                    <td className="py-3 px-4 text-center text-yellow-400">Variável (Mix fósseis/térmicas)</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">Viabilidade em Locações Isoladas (Off-Grid)</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400 bg-emerald-500/5 border-x border-white/5">Excelente (Sem custo de rede)</td>
                    <td className="py-3 px-4 text-center text-yellow-400">Incompleto (Requer BESS robusto)</td>
                    <td className="py-3 px-4 text-center text-yellow-400">Incompleto (Requer BESS robusto)</td>
                    <td className="py-3 px-4 text-center text-yellow-500">Inviável a longo prazo (frete de óleo)</td>
                    <td className="py-3 px-4 text-center text-rose-500">Inviabilizado pelo custo de km de cabos</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-black/30 p-4 rounded-xl border border-white/5 text-xs text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-[#f2ff00]/10 border border-[#f2ff00]/20 flex items-center justify-center text-[#f2ff00] flex-shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <p className="leading-relaxed">
                <strong>Análise Técnica:</strong> Enquanto soluções convencionais (Solar e Eólica) deixam enormes gaps energéticos devido à dependência do clima e necessitam de pesados bancos de baterias (BESS) apenas para sobrevivência noturna ou em calmaria, o <strong>Equipamento Cinético-Magnético OCTA</strong> garante operação constante Base Load. Ele atua como alimentador principal ou como o carregador perfeito de sistemas BESS para projetos distantes ou remotos da infraestrutura de rede nacional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS CATALOG SECTION ("Geradores Carenados" - Slides 4, 6 & Requested) */}
      <section id="produtos" className="py-24 relative bg-slate-950/30 border-y border-white/5 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
            <div className="max-w-2xl flex flex-col space-y-3">
              <span className="text-xs font-semibold text-[#f2ff00] uppercase tracking-wider">
                Catálogo Corporativo OCTA ENERGIA
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Nossos Geradores Carenados Silenciados
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Nossa linha de Geradores Magnéticos Cinéticos de Base é protegida por carenagens acústicas e térmicas de alta vedação, oferecendo baixíssimo nível de ruído e pintura epóxi antioxidante de longa vida útil.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={() => generateCatalogPDF()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold text-[#060606] bg-[#f2ff00] hover:bg-[#f2ff00]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg shadow-[#f2ff00]/10 border border-[#f2ff00]"
                id="btn-exportar-catalogo-pdf"
                title="Exportar Catálogo em PDF para Impressão"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Catálogo PDF</span>
              </button>
            </div>
          </div>

          {/* Range Filters for Grid view */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 pb-4 border-b border-white/5 gap-4">
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider font-semibold">Faixa de Carga Desejada:</span>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Todos os Modelos" },
                { id: "small", label: "15kVA - 100kVA" },
                { id: "medium", label: "200kVA - 300kVA" },
                { id: "large", label: "350kVA - 1MW" }
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedFilter(btn.id as any)}
                  className={`px-3.5 py-1.8 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedFilter === btn.id
                      ? "bg-[#f2ff00] text-black font-bold shadow-md shadow-[#f2ff00]/15"
                      : "bg-[#0d0d0d] text-slate-400 hover:text-white border border-white/5"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredGenerators.map((gen) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={gen.id}
                  className="flex flex-col rounded-2xl overflow-hidden bg-[#0d0d0d] border border-white/10 shadow-xl hover:border-[#f2ff00]/30 hover:shadow-2xl transition-all group"
                >
                  
                  {/* Photo area */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center p-3">
                    <img 
                      src={gen.image} 
                      alt={gen.name}
                      referrerPolicy="no-referrer"
                      className="object-contain w-full h-full transform group-hover:scale-105 transition-transform duration-500 rounded-lg"
                    />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-mono uppercase bg-black/90 border border-[#f2ff00]/30 text-[#f2ff00] px-2.5 py-1 rounded-md font-bold">
                        {gen.powerKw < 1000 ? `${gen.powerKw} kVA` : "1 MW"}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3">
                      <span className="text-[10px] font-bold bg-[#f2ff00] text-[#060606] px-2.5 py-1 rounded-md uppercase">
                        Sustentável
                      </span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10.5px] font-mono text-[#64748b] uppercase tracking-wider">{gen.category}</span>
                      <h3 className="font-display font-bold text-white text-lg tracking-tight leading-none group-hover:text-[#f2ff00] transition-colors">
                        {gen.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1.5 line-clamp-3">
                        {gen.description}
                      </p>
                    </div>

                    {/* Compact stats grid */}
                    <div className="grid grid-cols-2 gap-3.5 pt-3.5 border-t border-white/5 text-[11px] text-slate-400">
                      <div className="flex flex-col">
                        <span className="text-[#475569] font-medium">Voltagem Útil</span>
                        <span className="text-slate-200 font-semibold">{gen.voltage}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#475569] font-medium">Frequência VCA</span>
                        <span className="text-slate-200 font-semibold">{gen.frequency}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#475569] font-medium">Área Ocupada</span>
                        <span className="text-slate-200 font-semibold">{gen.areaNeeded}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[#475569] font-medium">Rendimento Real</span>
                        <span className="text-[#f2ff00] font-bold">{gen.efficiency}</span>
                      </div>
                    </div>

                    {/* Features list bullet */}
                    <div className="space-y-1 text-[11px] text-slate-300">
                      {gen.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-center space-x-2">
                           <Check className="w-3.5 h-3.5 text-[#f2ff00] flex-shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Details Button */}
                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedModel(gen)}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 hover:text-white border border-white/10 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                        Ficha Técnica Completa
                      </button>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* COMPACT FLOATING MODAL SHEET FOR COMPLETE TECHNICAL SPECIFICATIONS (Slide 10) */}
      <AnimatePresence>
        {selectedModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#070b13]/95 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white text-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-y-auto p-4 sm:p-8 rounded-sm border border-slate-300 font-sans my-4 print:my-0 print:border-none print:shadow-none print:p-0"
              style={{
                aspectRatio: "1 / 1.414",
                maxHeight: "calc(100vh - 2.5rem)",
                minHeight: "min(842px, 92vh)"
              }}
            >
              
              {/* Close Button Outside the pure sheet layout but inside the modal perspective */}
              <button
                onClick={() => setSelectedModel(null)}
                className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 transition-all shadow-md active:scale-95 print:hidden"
                title="Fechar catálogo"
                aria-label="Definir fechar modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* SHEET INNER CONTENT FRAME */}
              <div className="flex flex-col h-full justify-between">
                
                {/* 1. DOCUMENT HEADER */}
                <div className="border-b-[2px] border-slate-900 pb-3 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-display text-lg font-black tracking-tight text-slate-900">
                        OCTA <span className="text-emerald-600">ENERGIA</span>
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 block leading-tight mt-0.5 uppercase tracking-wide">
                      soluções em energia limpa
                    </span>
                    <span className="text-[9px] font-medium text-slate-500 block leading-none mt-0.5">
                      Grupo VALLEC PARTICIPAÇÕES
                    </span>
                  </div>
                  <div className="text-left sm:text-right font-mono text-[9px] text-slate-500 leading-tight">
                    <span className="font-bold text-slate-800 uppercase block">Ficha Técnica Oficial</span>
                    <span>Documento Técnico de Conformidade GAEL v2.5</span>
                    <span className="block mt-0.5">Fortaleza, CE • Brasil</span>
                  </div>
                </div>

                {/* 2. BODY OF DOCUMENT */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-1 sm:my-3">
                  
                  {/* Aspect Illustration & Core Identifier Left */}
                  <div className="md:col-span-5 flex flex-col justify-center items-center h-full bg-slate-50 rounded-lg p-4 border border-slate-100 relative">
                    <div className="absolute top-2 left-2 flex items-center space-x-1.5 text-[8px] font-mono text-emerald-600 font-bold bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded border border-emerald-500/10">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>PRODUTO CERTIFICADO</span>
                    </div>

                    <div className="w-full aspect-square max-w-[200px] flex items-center justify-center p-1 bg-white rounded shadow-sm border border-slate-200/60 overflow-hidden">
                      <img 
                        src={selectedModel.image} 
                        alt={selectedModel.name}
                        referrerPolicy="no-referrer"
                        className="object-contain w-full h-full max-h-[170px]"
                      />
                    </div>

                    <div className="text-center mt-3">
                      <h4 className="font-display font-black text-slate-900 text-sm tracking-tight leading-tight uppercase">
                        {selectedModel.name}
                      </h4>
                      <p className="text-[9.5px] text-slate-500 font-mono mt-0.5 uppercase">
                        {selectedModel.category}
                      </p>
                    </div>

                    <div className="w-full mt-3 p-2 bg-slate-200/50 rounded text-[9.5px] text-slate-700 leading-normal border border-slate-200 text-center italic">
                      "Unidade eletromecânica blindada, operando via campo cinético assistido livre de emissão de qualquer tipo de resíduo ou consumo primário fóssil."
                    </div>
                  </div>

                  {/* Characteristcs Specifications Table Right */}
                  <div className="md:col-span-7 flex flex-col justify-between h-full space-y-3.5">
                    
                    <div className="bg-slate-900 text-white rounded p-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold">ESPECIFICAÇÕES GAEL</span>
                      </div>
                      <span className="text-[11px] font-black text-emerald-400 font-mono">
                        {selectedModel.powerKw} kW
                      </span>
                    </div>

                    {/* Compact Specs Grid */}
                    <div className="space-y-1.5 text-[10.5px] sm:text-[11px]">
                      
                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Potência de Saída Nominal:</span>
                        <span className="text-slate-950 font-black font-mono">{selectedModel.powerKw} kW (Modular)</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Tensão Nominal Ajustável:</span>
                        <span className="text-slate-950 font-bold font-mono">{selectedModel.voltage}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Tipologia da Onda Fina:</span>
                        <span className="text-emerald-700 font-black uppercase text-[10px]">{selectedModel.waveType}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Frequência Útil de Operação:</span>
                        <span className="text-slate-950 font-mono">{selectedModel.frequency}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Configuração de Fases:</span>
                        <span className="text-slate-950 font-medium">{selectedModel.phase}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Refrigeração Inteligente:</span>
                        <span className="text-slate-900">{selectedModel.cooling}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Sistema de Partida:</span>
                        <span className="text-[#0284c7] font-semibold text-[10px] uppercase">{selectedModel.startingSystem}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Garantia Técnica Fabricante:</span>
                        <span className="text-slate-950 font-black font-mono text-[10px] uppercase">{selectedModel.warranty}</span>
                      </div>

                      <div className="flex justify-between items-center py-1 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Eficiência Projetada Real:</span>
                        <span className="text-emerald-700 font-black font-mono text-xs">{selectedModel.efficiency}</span>
                      </div>

                     </div>

                    {/* Interactive Actions area on the sheet */}
                    <div className="pt-4 flex print:hidden">
                      <button
                        onClick={() => setSelectedModel(null)}
                        className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 border border-slate-250 hover:bg-slate-800 rounded-lg transition-colors text-center shadow-sm"
                      >
                        Retornar ao Catálogo
                      </button>
                    </div>

                  </div>

                </div>

                {/* 3. CLIMATE & ENVIRONMENTAL CERTIFIED STAMPS (FUTTER OF SULFITE SHEET) */}
                <div className="border-t border-slate-200 pt-3">
                  <div className="text-[8px] font-mono uppercase text-slate-400 font-bold tracking-widest text-center mb-2.5">
                    Selo de Compromisso Ambiental & Governança Social - Registrado B2B
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    
                    {/* Seal 1 */}
                    <div className="p-1 px-1.5 rounded bg-slate-50 border border-slate-100 flex flex-col items-center justify-center min-h-[44px]">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                      <span className="text-[7.5px] font-bold text-slate-900 uppercase leading-none tracking-tight block">Baixo Carbono</span>
                      <span className="text-[6.5px] text-slate-400 font-sans tracking-tight block mt-0.5">Pegada de Emissão Zero</span>
                    </div>

                    {/* Seal 2 */}
                    <div className="p-1 px-1.5 rounded bg-slate-50 border border-slate-100 flex flex-col items-center justify-center min-h-[44px]">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mb-0.5" />
                      <span className="text-[7.5px] font-bold text-slate-900 uppercase leading-none tracking-tight block">Acordo do Clima</span>
                      <span className="text-[6.5px] text-slate-400 font-sans tracking-tight block mt-0.5">Tratados Internacionais</span>
                    </div>

                    {/* Seal 3 */}
                    <div className="p-1 px-1.5 rounded bg-slate-50 border border-slate-100 flex flex-col items-center justify-center min-h-[44px]">
                      <Sprout className="w-3.5 h-3.5 text-emerald-500 mb-0.5" />
                      <span className="text-[7.5px] font-bold text-slate-900 uppercase leading-none tracking-tight block">Energia Verde</span>
                      <span className="text-[6.5px] text-slate-400 font-sans tracking-tight block mt-0.5">Eficiência Eletromagnética</span>
                    </div>

                    {/* Seal 4 */}
                    <div className="p-1 px-1.5 rounded bg-slate-50 border border-slate-100 flex flex-col items-center justify-center min-h-[44px]">
                      <Activity className="w-3.5 h-3.5 text-[#0284c7] mb-0.5" />
                      <span className="text-[7.5px] font-bold text-slate-900 uppercase leading-none tracking-tight block">Padrão ESG</span>
                      <span className="text-[6.5px] text-slate-400 font-sans tracking-tight block mt-0.5">Sustentabilidade Ativa</span>
                    </div>

                  </div>

                  {/* Legal Corporate footer of Sulfite/A4 page */}
                  <div className="mt-3.5 pt-2 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-[7.5px] text-slate-400 uppercase font-mono leading-none gap-2">
                    <span className="text-center sm:text-left font-bold text-slate-500">
                      OCTA ENERGIA • CNPJ: 30.717.401/0001-28
                    </span>
                    <span className="text-center sm:text-right">
                      BS DESIGN • AV. DESEMBARGADOR MOREIRA, Nº 1300, SALA 711 T-NORTE - ALDEOTA, FORTALEZA - CE • CEP 60170-002
                    </span>
                  </div>

                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PERSONALIZED B2B PROPOSAL & QUOTE MODAL */}
      <AnimatePresence>
        {proposalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-3xl overflow-hidden my-8"
            >
              
              {/* Header bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#f2ff00]" />
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase font-mono">Gerador de Orçamento Inteligente</h3>
                    <h2 className="text-lg font-bold text-white">Proposta Técnico-Comercial Oficial</h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProposalModalOpen(false);
                    setProposalSuccess(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Document area */}
              <div className="p-6 md:p-8 max-h-[72vh] overflow-y-auto space-y-8 text-xs text-slate-300">
                
                {/* Customization input fields inside modal so the customer can type in real-time */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/5 space-y-4">
                  <span className="text-[10px] font-mono font-bold text-[#f2ff00] uppercase block">
                    &raquo; Customize os dados do cliente para a proposta comercial
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold text-[10px]">Nome do Responsável / Diretor:</label>
                      <input 
                        type="text"
                        placeholder="Ex: Dr. Carlos Menezes"
                        value={proposalCustomerName}
                        onChange={(e) => setProposalCustomerName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold text-[10px]">Razão Social / Nome da Empresa:</label>
                      <input 
                        type="text"
                        placeholder="Ex: Indústrias Aliança S/A"
                        value={proposalCustomerCompany}
                        onChange={(e) => setProposalCustomerCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg py-2 px-3 text-white text-xs focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* THE DRIFTING PROPOSAL SHEET */}
                <div className="p-8 rounded-2xl bg-white text-zinc-900 shadow-xl space-y-6 relative border border-slate-200">
                  
                  {/* Decorative stamp */}
                  <div className="absolute top-4 right-4 opacity-10 flex flex-col items-center select-none rotate-[15deg] pointer-events-none">
                    <Zap className="w-16 h-16 text-emerald-600" />
                    <span className="text-[9px] font-mono tracking-widest font-black uppercase">OCTA GREEN POWER</span>
                  </div>

                  {/* Header of proposal */}
                  <div className="border-b border-slate-300 pb-4 flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-black text-xl tracking-tight text-slate-900">OCTA ENERGIA</h4>
                      <p className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-wider leading-none">SOLUÇÕES EM ENERGIA LIMPA</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-bold text-slate-500 block">PROPOSTA ID: OCTA-{Math.round(simulatorPower)}-B2B</span>
                      <span className="text-xs text-slate-600 block">{new Date().toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  {/* Address part */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs select-none">
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1">PROMINENTE FORNECEDOR:</p>
                      <strong className="text-slate-950 font-bold">OCTA ENERGIA</strong>
                      <p className="text-slate-600 leading-normal mt-0.5">
                        CNPJ: 30.717.401/0001-28<br />
                        Aldeota, Fortaleza - CE • BS DESIGN • Sala 711 T-Norte
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-bold uppercase tracking-wider text-[9px] mb-1">CLIENTE DESTINATÁRIO:</p>
                      <strong className="text-slate-950 font-bold">{proposalCustomerCompany || "Empresa Cliente (B2B)"}</strong>
                      <p className="text-slate-600 leading-normal mt-0.5">
                        A/C Sr(a).: <strong className="text-slate-900 font-semibold">{proposalCustomerName || "Diretor Corporativo"}</strong><br />
                        Local de implantação indicado na simulação
                      </p>
                    </div>
                  </div>

                  {/* Commercial strategy explanation paragraph */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <h5 className="font-bold text-slate-950 uppercase text-[10px] tracking-wider">1. Objeto & Memorial de Dimensionamento</h5>
                    {simulatorMode === "locacao" ? (
                      <p className="text-slate-700 leading-relaxed text-justify text-[11px]">
                        A presente proposta estabelece os termos de <strong>Locação Comercial de Ativos e Contrato ESCO de Eficiência Energética</strong>. Através deste modelo de utilidade, a OCTA ENERGIA assume integralmente o custo de CAPEX (investimento de capital direto) de fabricação e comissionamento de <strong className="text-slate-950 font-semibold">{suggestedGenerator.name} ({simulatorPower < 1000 ? `${simulatorPower} kVA` : "1 MW"})</strong> em suas instalações industriais/comerciais. 
                        Toda a energia elétrica gerada pelo rotor magnético limpo é injetada em sua subestação interna convencional. A medição ocorre na saída da máquina, faturando o consumo efetivo kwh baseado em uma estratégia de <strong className="text-emerald-600 font-bold">Desconto Garantido de {simulatorEscoDiscount}%</strong> em relação aos R$ {simulatorTariff.toFixed(2)}/kWh da distribuidora pública.
                      </p>
                    ) : (
                      <p className="text-slate-700 leading-relaxed text-justify text-[11px]">
                        A presente proposta estabelece a <strong>Aquisição e Implantação de Ativo de Auto-Geração Tecnológica (Venda Direta)</strong>. Sob esta modalidade, o cliente investe diretamente no sistema <strong className="text-slate-950 font-semibold">{suggestedGenerator.name} ({simulatorPower < 1000 ? `${simulatorPower} kVA` : "1 MW"})</strong>, passando a ser proprietário físico do gerador magnético cinético.
                        Isto assegura redundância térmica, resiliência total contra aumentos tarifários públicos e elimina em 100% o consumo da concessionária local até o montante gerado pela turbina, garantindo faturamento residual e payback rápido amortizável em prazo extremamente curto.
                      </p>
                    )}
                  </div>

                  {/* System Image and Specs Box */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-205 items-center">
                    <div className="md:col-span-4 rounded-lg border border-slate-300 overflow-hidden shadow">
                      <img 
                        src={suggestedGenerator.image} 
                        alt={suggestedGenerator.name} 
                        className="w-full h-32 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="md:col-span-8 space-y-1 text-slate-800">
                      <span className="text-[8px] font-mono font-bold text-amber-600 bg-amber-100 border border-amber-200 rounded px-1.5 py-0.5 uppercase">Rotor Magnético Autônomo</span>
                      <h4 className="font-bold text-slate-900 text-sm">{suggestedGenerator.name}</h4>
                      <p className="text-[10.5px] text-slate-600 italic leading-snug">{suggestedGenerator.description}</p>
                      
                      <div className="grid grid-cols-2 gap-y-1 gap-x-3 pt-2 text-[10px] font-mono text-slate-700 border-t border-slate-200">
                        <div>Tensão Nominal: <span className="font-bold text-slate-950">{suggestedGenerator.voltage}</span></div>
                        <div>Formato de Onda: <span className="font-bold text-slate-950">{suggestedGenerator.waveType}</span></div>
                        <div>Área de Planta: <span className="font-bold text-slate-950">{suggestedGenerator.areaNeeded}</span></div>
                        <div>Config. Fases: <span className="font-bold text-slate-950">{suggestedGenerator.phase}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Comparison and Viability Table */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-950 uppercase text-[10px] tracking-wider">2. Planilha Comparativa de Viabilidade Financeira</h5>
                    
                    <div className="border border-slate-300 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-800 uppercase font-mono text-[9px] border-b border-slate-300">
                            <th className="p-2.5">Indicador Técnico-Comercial</th>
                            <th className="p-2.5 text-center">Situação Concessionária</th>
                            <th className="p-2.5 text-right bg-emerald-50 text-emerald-800 font-bold">Cenário Proposto OCTA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-850">
                          <tr>
                            <td className="p-2.5 font-semibold">Fonte de Energia Principal</td>
                            <td className="p-2.5 text-center text-rose-600">
                              {isOffGrid ? "Rede Elétrica Inexistente / Afastada" : "Rede Elétrica Instável"}
                            </td>
                            <td className="p-2.5 text-right font-medium text-emerald-600 bg-emerald-50/20 font-bold">
                              {isOffGrid ? "Híbrido Off-Grid (OCTA + BESS)" : "Auto-Geração Magnética Auxiliar"}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold">Demanda / Consumo de Referência</td>
                            <td className="p-2.5 text-center font-mono">
                              {manualConsumption.toLocaleString("pt-BR")} kWh/mês
                            </td>
                            <td className="p-2.5 text-right font-mono bg-emerald-50/20">
                              {manualConsumption.toLocaleString("pt-BR")} kWh/mês
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold">Tarifa Equivalente Real Cobrada</td>
                            <td className="p-2.5 text-center font-mono">
                              {isOffGrid ? "Extensão de Rede Inviável" : `R$ ${simulatorTariff.toFixed(2)} / kWh`}
                            </td>
                            <td className="p-2.5 text-right font-mono text-emerald-600 font-bold bg-emerald-50/20">
                              {isOffGrid ? "Custear Baterias BESS Autônomas" : (simulatorMode === "locacao" 
                                ? `R$ ${(simulatorTariff * (1 - simulatorEscoDiscount/100)).toFixed(2)}/kWh` 
                                : "Autogerado (Custo Variável Zero)")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold">Fatura com Impostos (Base mensal)</td>
                            <td className="p-2.5 text-center font-mono">
                              {isOffGrid ? "Custos de Conexão Elevados" : `R$ ${manualBill.toLocaleString("pt-BR")}`}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-950 font-semibold bg-emerald-50/20">
                              {isOffGrid ? "Amortizado (Extensão R$ 0)" : (simulatorMode === "locacao" 
                                ? `R$ ${(manualBill * (1 - simulatorEscoDiscount/100)).toLocaleString("pt-BR")}` 
                                : "Apenas TUSD Reduzida de Rede")}
                            </td>
                          </tr>
                          {isOffGrid && (
                            <tr className="bg-amber-50">
                              <td className="p-2.5 font-bold text-amber-900">INFRAESTRUTURA DE REDE INVIÁVEL (Evitada)</td>
                              <td className="p-2.5 text-center text-rose-600 font-mono">Gasto Médio: R$ 750.000</td>
                              <td className="p-2.5 text-right font-mono text-emerald-700 bg-emerald-50 font-black">
                                POUPADO: R$ 750.000,00!
                              </td>
                            </tr>
                          )}
                          <tr className="bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-950">ECONOMIA LÍQUIDA MENSAL</td>
                            <td className="p-2.5 text-center text-slate-400">R$ 0,00</td>
                            <td className="p-2.5 text-right font-mono text-emerald-600 font-extrabold text-xs bg-emerald-50">
                              R$ {simulatedMonthlySavings.toLocaleString("pt-BR")}
                            </td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-slate-950">Economia Acumulada em 1 Ano</td>
                            <td className="p-2.5 text-center text-slate-400">R$ 0,00</td>
                            <td className="p-2.5 text-right font-mono text-cyan-600 font-extrabold bg-emerald-50/20 text-xs">
                              R$ {simulatedAnnualSavings.toLocaleString("pt-BR")}
                            </td>
                          </tr>
                          <tr className="bg-slate-50 font-bold">
                            <td className="p-2.5">Investimento Necessário (CAPEX Adesão)</td>
                            <td className="p-2.5 text-center text-slate-400">-</td>
                            <td className="p-2.5 text-right text-indigo-700 bg-indigo-50">
                              {simulatorMode === "locacao" ? "R$ 0,00 (ZERO CAPEX)" : `R$ ${currentCapex.toLocaleString("pt-BR")},00`}
                            </td>
                          </tr>
                          <tr className="font-bold">
                            <td className="p-2.5">Período de Amortização (Payback)</td>
                            <td className="p-2.5 text-center text-slate-400">-</td>
                            <td className="p-2.5 text-right text-slate-900 bg-emerald-50/20">
                              {simulatorMode === "locacao" ? "De Fluxo Imediato" : `${estPaybackMonths} a ${estPaybackMonths + 4} Meses`}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 5 years cashflow forecast mini */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-950 uppercase text-[10px] tracking-wider">3. Projeção de Amortização Acumulada em 5 Anos</h5>
                    <div className="grid grid-cols-5 gap-2.5 text-center text-[11px] font-mono">
                      {[1, 2, 3, 4, 5].map((y) => (
                        <div key={y} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                          <span className="text-slate-500 font-semibold text-[9px] block font-sans">Ano {y}</span>
                          <strong className="text-emerald-700 text-[11px] mt-1 block">R$ {(y * simulatedAnnualSavings / 1000).toFixed(0)}k</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legal Term segments and signature block */}
                  <div className="pt-4 border-t border-slate-300 text-[9px] leading-relaxed text-slate-500 text-justify">
                    <p>
                      <strong>INFORMAÇÕES ADICIONAIS:</strong> Os prazos de implantação física (isolamento magnético e interligação elétrica) compreendem em média 60 dias. Os valores de compra são flutuantes sob variação cambial direta de neodímio NdFeB N52 e suprimentos eletrônicos importados. Esta proposta possui validade comercial de 30 dias contados a partir da data de emissão.
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-center select-none">
                    <div className="space-y-3">
                      <div className="h-[1px] bg-slate-300 w-36 mx-auto" />
                      <div className="text-[10px] text-slate-700 font-semibold">{proposalCustomerCompany || "Empresa Cliente (B2B)"}</div>
                      <div className="text-[8.5px] text-slate-500 font-mono leading-none">De Acordo &amp; Aceite Eletrônico</div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-[1px] bg-slate-300 w-36 mx-auto" />
                      <div className="text-[10px] text-slate-[#070b13] font-bold">OCTA ENERGIA B2B LTDA</div>
                      <div className="text-[8.5px] text-slate-500 font-mono leading-none">Fortaleza-CE, Brasil</div>
                    </div>
                  </div>

                  {/* COMPLIANCE SEALS & CERTIFICATIONS FOOTER */}
                  <div className="mt-8 pt-4 border-t border-slate-200">
                    <div className="text-[8px] font-mono uppercase text-slate-400 font-bold tracking-wider text-center mb-3">
                      Selo de Compromisso Ambiental & Governança Social - Registrado B2B
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Seal 1 */}
                      <div className="p-2 bg-emerald-50/50 border border-emerald-100 flex items-center space-x-2.5 rounded-xl">
                        <Leaf className="w-5 h-5 text-emerald-600 block flex-shrink-0" />
                        <div>
                          <strong className="text-[9px] font-bold text-slate-900 uppercase tracking-tight block leading-none">Baixo Carbono</strong>
                          <span className="text-[7.5px] text-slate-500 font-sans tracking-tight block mt-0.5 leading-none">Pegada Ambiental Zero</span>
                        </div>
                      </div>
                      
                      {/* Seal 2 */}
                      <div className="p-2 bg-amber-50/50 border border-amber-100 flex items-center space-x-2.5 rounded-xl">
                        <Sprout className="w-5 h-5 text-amber-600 block flex-shrink-0" />
                        <div>
                          <strong className="text-[9px] font-bold text-slate-900 uppercase tracking-tight block leading-none">Energia Verde</strong>
                          <span className="text-[7.5px] text-slate-500 font-sans tracking-tight block mt-0.5 leading-none">Magnetismo NdFeB</span>
                        </div>
                      </div>

                      {/* Seal 3 */}
                      <div className="p-2 bg-blue-50/50 border border-blue-100 flex items-center space-x-2.5 rounded-xl">
                        <Activity className="w-5 h-5 text-blue-600 block flex-shrink-0" />
                        <div>
                          <strong className="text-[9px] font-bold text-slate-900 uppercase tracking-tight block leading-none">Compliance ESG</strong>
                          <span className="text-[7.5px] text-slate-500 font-sans tracking-tight block mt-0.5 leading-none">Sustentabilidade Ativa</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Action buttons at foot of modal */}
              <div className="p-6 border-t border-white/5 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-xs text-slate-400 space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Proposta comercial dinâmica baseada em valores inteligentes.</span>
                </div>
                
                <div className="flex space-x-3 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isGeneratingModalPDF}
                    onClick={() => {
                      setIsGeneratingModalPDF(true);
                      setTimeout(() => {
                        generateFinancialPDF({
                          power: simulatorPower,
                          tariff: simulatorTariff,
                          uptime: simulatorUptime,
                          monthlyKwh: simulatedMonthlyKwh,
                          monthlySavings: simulatedMonthlySavings,
                          annualSavings: simulatedAnnualSavings,
                          payback: estPaybackMonths,
                          trees: treesEquiv,
                          strategy: simulatorMode,
                          escoDiscount: simulatorEscoDiscount,
                          monthlyBill: manualBill,
                          customerName: proposalCustomerName || "Default Customer",
                          customerCompany: proposalCustomerCompany || "Empresa Cliente",
                          generatorName: suggestedGenerator.name,
                          isOffGrid: isOffGrid
                        });
                        setProposalSuccess(true);
                        setIsGeneratingModalPDF(false);
                      }, 1500);
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-bold text-black bg-[#f2ff00] hover:bg-[#f2ff00]/90 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer shadow transition-all"
                  >
                    {isGeneratingModalPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1.5 animate-spin [animation-duration:1s]" />
                        Compilando Proposta...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1.5" />
                        Baixar Proposta em PDF
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProposalModalOpen(false);
                      setProposalSuccess(false);
                    }}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/50 hover:bg-slate-950 transition-colors cursor-pointer"
                  >
                    Fechar Orçamento
                  </button>
                </div>
              </div>

              {/* Toast response message */}
              {proposalSuccess && (
                <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-[11px] font-bold text-emerald-400 flex items-center shadow-lg backdrop-blur-md">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Orçamento e PDF Descarregado com sucesso!
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="relative bg-[#04070d] border-t border-white/5 text-slate-400 py-16 z-10 overflow-hidden">
        
        {/* Subtle glow background */}
        <div className="absolute bottom-0 left-[10%] w-[40%] h-[300px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
            
            {/* Branding Column */}
            <div className="md:col-span-5 flex flex-col space-y-4">
              <a href="#inicio" className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 shadow shadow-emerald-500/25">
                  <InfinityIcon className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-lg font-bold tracking-tight text-white leading-none">
                    OCTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">ENERGIA</span>
                  </span>
                  <span className="text-[10px] font-medium tracking-normal text-[#f2ff00] mt-1">
                    soluções em energia limpa
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-slate-500 uppercase mt-0.5">
                    Grupo VALLEC PARTICIPAÇÕES
                  </span>
                </div>
              </a>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Iniciativa nacional comprometida com a transição mundial de energia. Soluções ecológicas sem queima de hidrocarbonetos para a máxima independência física de redes caras e flutuantes.
              </p>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 flex flex-col space-y-3.5 text-xs text-slate-400">
              <strong className="text-white uppercase tracking-wider text-[10px] font-mono">Estrutura do Site</strong>
              <div className="grid grid-cols-2 gap-2">
                <a href="#inicio" className="hover:text-white transition-colors">Início</a>
                <a href="#quem-somos" className="hover:text-white transition-colors">Quem Somos</a>
                <a href="#tecnologia" className="hover:text-white transition-colors">Nossa Física</a>
                <a href="#produtos" className="hover:text-white transition-colors">Produtos</a>
              </div>
            </div>

            {/* Regulatory context */}
            <div className="md:col-span-4 flex flex-col space-y-3.5 text-xs">
              <strong className="text-white uppercase tracking-wider text-[10px] font-mono">Normativas & Conformidade</strong>
              <p className="text-[#64748b] leading-relaxed">
                Nossos alternadores, cabos e painéis de controle digital atendem estritamente as regulamentações normativas da <strong>ABNT NBR</strong> brasileiras de segurança metalúrgica e isolamento acústico industrial.
              </p>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                PROJETO REGISTRADO B2B
              </span>
            </div>

          </div>

          {/* SELOS DE GOVERNANÇA CLIMÁTICA & ENERGIA LIMPA */}
          <div className="py-8 my-8 border-y border-white/5">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#f2ff00] font-bold mb-5 tracking-wider">
              <span className="h-2 w-2 rounded-full bg-[#f2ff00] animate-pulse"></span>
              <span>Selos de Governança Climática & Sustentabilidade</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Selo 1: Baixo Carbono */}
              <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/10 hover:border-emerald-500/25 transition-colors flex items-start space-x-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white uppercase tracking-tight">Baixo Carbono</h6>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Pegada ambiental neutra. Geração mecânica assistida livre de subprodutos de combustão.
                  </p>
                </div>
              </div>

              {/* Selo 2: Acordos Internacionais */}
              <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/10 hover:border-cyan-500/25 transition-colors flex items-start space-x-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white uppercase tracking-tight">Tratados de Clima</h6>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Em total conformidade com as diretrizes do Acordo de Paris para descarbonização industrial.
                  </p>
                </div>
              </div>

              {/* Selo 3: Energia Verde */}
              <div className="p-4 rounded-xl bg-black/60 border border-[#f2ff00]/10 hover:border-[#f2ff00]/25 transition-colors flex items-start space-x-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-[#f2ff00]/10 border border-[#f2ff00]/20 flex items-center justify-center flex-shrink-0 text-[#f2ff00] group-hover:bg-[#f2ff00]/20 transition-all">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white uppercase tracking-tight">Energia Verde Certificada</h6>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Matriz limpa de partida única e rotação assistida permanente por Neodímio NdFeB.
                  </p>
                </div>
              </div>

              {/* Selo 4: ESG Compliant */}
              <div className="p-4 rounded-xl bg-black/60 border border-blue-500/10 hover:border-blue-500/25 transition-colors flex items-start space-x-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400 group-hover:bg-blue-500/20 transition-all">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h6 className="text-xs font-bold text-white uppercase tracking-tight">Padrão ESG Alinhado</h6>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    Governança ambiental ativa para economia de insumos e diminuição de despesas operacionais.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Copyright Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex flex-col space-y-1 text-center sm:text-left">
              <span>
                &copy; {new Date().getFullYear()} <strong>OCTA ENERGIA</strong>. Todos os direitos reservados.
              </span>
              <span className="text-[10px] text-[#475569]">
                Empresarial BS DESIGN, Sala 711 T-Norte - Aldeota - Avenida Desembargador Moreira, 1300, Fortaleza - CE. CEP 60170-002
              </span>
            </div>
            
            {/* Disclaimer page bottom */}
            <div className="flex space-x-6 text-[#475569] text-[10.5px]">
              <span className="hover:text-slate-400 cursor-pointer">Termos de Uso</span>
              <span className="hover:text-slate-400 cursor-pointer">Política de Privacidade</span>
              <span className="text-[#10b981] font-bold font-mono">VALLEC PARTICIPAÇÕES</span>
            </div>
          </div>

        </div>

      </footer>

    </div>
  );
}

// Simple Helper for Mini-Badges inside card structures
function Badge({ text, color }: { text: string; color: "emerald" | "cyan" | "indigo" }) {
  const styles = {
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    indigo: "bg-[#4338ca]/10 border-[#4f46e5]/20 text-blue-400"
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-md border uppercase ${styles[color]}`}>
      {text}
    </span>
  );
}
