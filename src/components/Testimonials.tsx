import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Quote, Cpu, Sprout, ChevronLeft, ChevronRight, Building } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  sector: "Datacenter" | "Agronegócio";
  text: string;
  location: string;
  powerUsed: string;
  avatarLetter: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Eng. Marcos Silveira",
    role: "Diretor de Infraestrutura e Energia",
    company: "Nexus HyperScale Datacenters",
    sector: "Datacenter",
    text: "Para nossa planta de processamento de Inteligência Artificial, a instabilidade e o custo de demanda contratada da concessionária eram gargalos críticos. O gerador magnético cinético OCTA 1MW Megawatt Station de base load se provou a solução definitiva. Comprovamos zero consumo de diesel, baixo ruído e fomos certificados como Datacenter Verde de alta eficiência no Brasil.",
    location: "Barueri, SP",
    powerUsed: "OCTA 1MW Megawatt Station",
    avatarLetter: "M"
  },
  {
    id: 2,
    name: "Juliana Schmidt",
    role: "Gerente Geral de Operações e Sustentabilidade",
    company: "Cooperativa AgroIndustrial Cultivar",
    sector: "Agronegócio",
    text: "Sistemas tradicionais de energia solar sofrem com a sazonalidade e não operam à noite, quando nossas secadoras de grãos mais precisam de carga. A tecnologia autônoma de base load da OCTA ENERGIA preencheu esse gap com perfeição. O OCTA 500kW Heavy-Duty no interior paranaense garantiu uma safra estável, segura e 100% livre de interrupções de concessionárias.",
    location: "Cascavel, PR",
    powerUsed: "OCTA 500kW Heavy-Duty",
    avatarLetter: "J"
  },
  {
    id: 3,
    name: "Dra. Eliana Rodrigues",
    role: "CTO & Sócia Fundadora",
    company: "Solis Cloud Infrastructure",
    sector: "Datacenter",
    text: "A latência e o uptime são sagrados para nossos clientes de colocation. Contar com a micro-usina autônoma de 300kW da OCTA integrada às nossas baterias BESS nos deu total blindagem física de rede cara. Um payback real que superou nossas expectativas de conselho e elevou nossa governança ESG.",
    location: "Fortaleza, CE",
    powerUsed: "OCTA 300kW (Premium)",
    avatarLetter: "E"
  },
  {
    id: 4,
    name: "Roberto F. Guimarães",
    role: "Proprietário e Diretor Executivo",
    company: "Fazendas Guimarães & Associados",
    sector: "Agronegócio",
    text: "O isolamento de rede no agronegócio de alta produtividade custava caro em cabos e taxas de extensão. Com a instalação em terra dos geradores silenciados de 250kW da OCTA, obtivemos fluxo contínuo de energia de base load nas bombas de irrigação. Pintura epóxi impecável e baixíssimo ruído que não perturba o rebanho.",
    location: "Sorriso, MT",
    powerUsed: "OCTA 250kW Carenado",
    avatarLetter: "R"
  }
];

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState<"todos" | "datacenter" | "agronegocio">("todos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeTab === "todos") return true;
    return t.sector.toLowerCase() === activeTab;
  });

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  // Autoplay functionality
  const startAutoplay = () => {
    stopAutoplay();
    timerRef.current = setInterval(() => {
      handleNext();
    }, 7000); // changes every 7 seconds
  };

  const stopAutoplay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [currentIndex, activeTab]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === filteredTestimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentTestimonial = filteredTestimonials[currentIndex];

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 150 : -150,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 150 : -150,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 220, damping: 24 },
        opacity: { duration: 0.18 }
      }
    })
  };

  return (
    <section 
      id="testimonials" 
      className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-white/5 z-20"
      onMouseEnter={stopAutoplay}
      onMouseLeave={startAutoplay}
    >
      {/* Decorative ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#f2ff00]/3 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1 bg-[#f2ff00]/10 border border-[#f2ff00]/20 text-[#f2ff00] rounded-full uppercase tracking-wider mb-4 font-mono">
            <Building className="w-3.5 h-3.5 mr-1" />
            <span>Casos de Referência</span>
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Vozes da Indústria: Depoimentos de Liderança
          </h2>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Consulte o parecer prático e reais depoimentos de diretores e gerentes de infraestrutura que asseguraram transição energética ativa e amortização em tempo recorde nos setores de Datacenter e Agronegócio.
          </p>

          {/* Sector Tabs/Filter */}
          <div className="flex items-center justify-center space-x-2.5 mt-8 border border-white/5 p-1 rounded-full bg-slate-900/60 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("todos")}
              className={`px-4 py-1.8 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "todos"
                  ? "bg-[#f2ff00] text-black shadow-md shadow-[#f2ff00]/15"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Todos os Setores
            </button>
            <button
              onClick={() => setActiveTab("datacenter")}
              className={`px-4 py-1.8 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "datacenter"
                  ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/15"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Cpu className="w-3 h-3" />
              <span>Datacenters</span>
            </button>
            <button
              onClick={() => setActiveTab("agronegocio")}
              className={`px-4 py-1.8 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center space-x-1.5 ${
                activeTab === "agronegocio"
                  ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/15"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Sprout className="w-3 h-3" />
              <span>Agronegócio</span>
            </button>
          </div>
        </div>

        {/* Carousel Outer Container */}
        <div className="relative min-h-[360px] md:min-h-[290px] flex items-center justify-center max-w-4xl mx-auto">
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {currentTestimonial ? (
              <motion.div
                key={currentTestimonial.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full bg-[#0a0f1d] border border-white/5 rounded-3xl p-8 sm:p-10 md:p-12 shadow-2xl relative"
              >
                {/* Large Background Quote Icon */}
                <div className="absolute top-6 right-8 text-neutral-800/25 pointer-events-none select-none">
                  <Quote className="w-20 h-20 md:w-28 md:h-28 rotate-180" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 relative z-10">
                  
                  {/* Left Side: Avatar/Icon and Tech Badges */}
                  <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/3 flex-shrink-0">
                    <div className="relative mb-4">
                      {/* Outer Pulse Glow ring */}
                      <span className={`absolute inset-0 rounded-2xl animate-ping opacity-20 ${
                        currentTestimonial.sector === "Datacenter" ? "bg-cyan-500" : "bg-emerald-500"
                      }`} />
                      
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold font-display cursor-default border ${
                        currentTestimonial.sector === "Datacenter" 
                          ? "bg-cyan-950/80 text-cyan-400 border-cyan-500/30" 
                          : "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                      }`}>
                        {currentTestimonial.avatarLetter}
                      </div>

                      {/* Sector Mini Icon Badge */}
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg border text-white ${
                        currentTestimonial.sector === "Datacenter" 
                          ? "bg-cyan-500 border-cyan-600" 
                          : "bg-emerald-500 border-emerald-600"
                      }`}>
                        {currentTestimonial.sector === "Datacenter" ? <Cpu className="w-3 h-3" /> : <Sprout className="w-3 h-3" />}
                      </div>
                    </div>

                    <h4 className="font-bold text-white text-base font-display">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-slate-400 text-xs mt-0.5 font-medium leading-tight">
                      {currentTestimonial.role}
                    </p>
                    <p className="text-slate-500 text-[11px] leading-tight">
                      {currentTestimonial.company}
                    </p>

                    <div className="mt-4 flex flex-col items-center md:items-start space-y-1.5 w-full">
                      <span className={`inline-block px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                        currentTestimonial.sector === "Datacenter"
                          ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      }`}>
                        Setor {currentTestimonial.sector}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#f2ff00] mr-1.5 animate-pulse" />
                        {currentTestimonial.powerUsed}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Quote Text */}
                  <div className="flex-1">
                    <Quote className="w-8 h-8 text-[#f2ff00]/40 mb-3 block" />
                    <p className="text-slate-200 text-sm md:text-base leading-relaxed text-justify italic">
                      "{currentTestimonial.text}"
                    </p>
                    
                    <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Planta: {currentTestimonial.location}</span>
                      <span className="text-emerald-400 font-bold">✓ Homologado OCTA</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ) : (
              <div className="p-8 text-center text-slate-400">Nenhum depoimento encontrado nesta categoria.</div>
            )}
          </AnimatePresence>

          {/* Floating Navigation Chevrons */}
          <button
            onClick={handlePrev}
            aria-label="Depoimento Anterior"
            className="absolute left-[-20px] sm:left-[-30px] md:left-[-54px] w-11 h-11 rounded-full border border-white/5 bg-[#0a0f1d] hover:bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl focus:outline-none z-10 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Próximo Depoimento"
            className="absolute right-[-20px] sm:right-[-30px] md:right-[-54px] w-11 h-11 rounded-full border border-white/5 bg-[#0a0f1d] hover:bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl focus:outline-none z-10 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Dots Navigation indicators */}
        {filteredTestimonials.length > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            {filteredTestimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleDotClick(idx)}
                aria-label={`Ir para slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                  idx === currentIndex 
                    ? "w-6 bg-[#f2ff00]" 
                    : "w-2 bg-slate-700 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
