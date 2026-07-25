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
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { companyName, originalName, generatorsData, financialPremises, aboutCompanyText, marketChallenges } from "./data";
import { GeneratorModel } from "./types";
import { generateFinancialPDF, generateCatalogPDF } from "./utils/pdfGenerator";
import EcoBanner from "./components/EcoBanner";
import { GoogleTranslate } from "./components/GoogleTranslate";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { submitContactForm } from "./services/contactService";

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
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);
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
      const sections = ["inicio", "quem-somos", "tecnologia", "produtos", "viabilidade", "faturamento", "whatsapp-ia", "contato"];
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
  // 15kVA: R$ 220k | 30kVA: R$ 450k | 50kVA: R$ 750k | 100kVA: R$ 1.25M | 200kVA: R$ 1.65M | 250kVA: R$ 1.9M | 300kVA: R$ 2.3M | 350kVA: R$ 2.6M | 400kVA: R$ 2.95M | 450kVA: R$ 3.25M | 500kVA: R$[...]
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
    // Clear error message on input change
    if (formSubmitError) {
      setFormSubmitError(null);
    }
  };

  const submitForm = async (e: React.FormEvent) => {
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

    // Start loading state
    setFormSubmitLoading(true);
    setFormSubmitError(null);

    try {
      // Call the API service
      const response = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        interestPower: formData.interestPower,
        currentBill: formData.currentBill,
        notes: formData.notes
      });

      if (response.success) {
        setFormSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          resetForm();
        }, 3000);
      } else {
        setFormSubmitError(response.message || "Erro ao enviar formulário. Tente novamente.");
      }
    } catch (error) {
      setFormSubmitError("Erro ao enviar formulário. Tente novamente mais tarde.");
      console.error("Form submission error:", error);
    } finally {
      setFormSubmitLoading(false);
    }
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
    setFormSubmitError(null);
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
                { id: "produtos", label: "Geradores Carenados" },
                { id: "contato", label: "Contato" }
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
                  { id: "produtos", label: "Geradores Carenados" },
                  { id: "contato", label: "Contato" }
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

      {/* CONTACT SECTION */}
      <section id="contato" className="py-24 relative bg-[#07080a] border-t border-white/5 z-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <span className="text-xs font-mono text-[#f2ff00] uppercase tracking-widest bg-[#f2ff00]/10 px-3 py-1 rounded-full">Fale Conosco</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-4">Contato Comercial</h2>
            <p className="text-slate-400 text-sm mt-2">Preencha o formulário e entraremos em contato para agendar uma reunião técnica.</p>
          </div>
       
          <div className="bg-[#0b0b0d] p-6 rounded-2xl border border-white/5">
            {formSubmitted ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-4"
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-emerald-400">Obrigado!</h3>
                <p className="mt-2 text-slate-300">Recebemos sua solicitação. Nossa equipe entrará em contato em breve.</p>
                <button
                  onClick={resetForm}
                  className="mt-6 inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold bg-[#f2ff00] text-[#060606]"
                >
                  Enviar outro contato
                </button>
              </div>
            ) : (
              <form onSubmit={submitForm} className="space-y-4">
                {/* Error message */}
                {formSubmitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-rose-300">Erro ao enviar</p>
                      <p className="text-xs text-rose-200 mt-1">{formSubmitError}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Nome</label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      disabled={formSubmitLoading}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#050608] border border-white/5 text-white text-sm disabled:opacity-50"
                    />
                    {formErrors.name && <p className="text-rose-400 text-xs mt-1">{formErrors.name}</p>}
                  </div>
          
                  <div>
                    <label className="text-xs text-slate-400">Empresa</label>
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                      disabled={formSubmitLoading}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#050608] border border-white/5 text-white text-sm disabled:opacity-50"
                    />
                    {formErrors.company && <p className="text-rose-400 text-xs mt-1">{formErrors.company}</p>}
                  </div>
          
                  <div>
                    <label className="text-xs text-slate-400">E-mail</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      disabled={formSubmitLoading}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#050608] border border-white/5 text-white text-sm disabled:opacity-50"
                    />
                    {formErrors.email && <p className="text-rose-400 text-xs mt-1">{formErrors.email}</p>}
                  </div>
          
                  <div>
                    <label className="text-xs text-slate-400">Telefone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      disabled={formSubmitLoading}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#050608] border border-white/5 text-white text-sm disabled:opacity-50"
                    />
                    {formErrors.phone && <p className="text-rose-400 text-xs mt-1">{formErrors.phone}</p>}
                  </div>
          
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-400">Interesse (kW aproximado)</label>
                    <select
                      name="interestPower"
                      value={formData.interestPower}
                      onChange={handleFormChange}
                      disabled={formSubmitLoading}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#050608] border border-white/5 text-white text-sm disabled:opacity-50"
                    >
                      <option value="15">15 kW</option>
                      <option value="50">50 kW</option>
                      <option value="100">100 kW</option>
                      <option value="300">300 kW</option>
                      <option value="1000">1 MW</option>
                    </select>
                  </div>
          
                  <div className="md:col-span-2">
                    <label className="text-xs text-slate-400">Mensagem / Observações</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      disabled={formSubmitLoading}
                      rows={4}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-[#050608] border border-white/5 text-white text-sm disabled:opacity-50"
                    />
                  </div>
          
                  <div className="md:col-span-2 flex items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={formSubmitLoading}
                      className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#f2ff00] text-[#060606] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formSubmitLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Contato"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={formSubmitLoading}
                      className="inline-flex items-center px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Limpar
                    </button>
                    <div className="text-xs text-slate-400">ou ligue: <strong className="text-white">+55 (85) 99404-5663</strong></div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

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
