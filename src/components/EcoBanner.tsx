import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause,
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Tv,
  Award,
  Leaf,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=90",
    label: "Primeiros Passos",
    desc: "Crescer é aprender, crescer é superar-se a cada dia"
  },
  {
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=90",
    label: "Educação e Futuro",
    desc: "Crescer é aprender, crescer é superar-se a cada dia"
  },
  {
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=90",
    label: "Trânsito Urbano",
    desc: "Crescer é adaptar-se as mudanças, o mundo está mudando, e nós estamos mudando"
  },
  {
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=90",
    label: "Cidades Iluminadas",
    desc: "Crescer é adaptar-se as mudanças, o mundo está mudando, e nós estamos mudando"
  },
  {
    url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=90",
    label: "Conexão Digital",
    desc: "Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos"
  },
  {
    url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1200&q=90",
    label: "Voo de Tecnologia",
    desc: "Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos"
  },
  {
    url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=90",
    label: "Cultura e Energia",
    desc: "Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos"
  },
  {
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=90",
    label: "Trabalho Coletivo",
    desc: "porque o que fazemos hoje afetará o amanhã, na OCTA ENERGIA trabalhamos a mais de 10 anos em desenvolvimento de soluções"
  },
  {
    url: "https://images.unsplash.com/photo-1516841273335-e39b37888115?auto=format&fit=crop&w=1200&q=90",
    label: "Sabedoria Conectada",
    desc: "Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos"
  },
  {
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=90",
    label: "Santuários Subaquáticos",
    desc: "Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade"
  },
  {
    url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=90",
    label: "Florestas Preservadas",
    desc: "Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade"
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=90",
    label: "Harmonia Costeira",
    desc: "Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade"
  },
  {
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=90",
    label: "Oceano Infinito",
    desc: "Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade"
  },
  {
    url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=90",
    label: "Caminhos da Natureza",
    desc: "Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade"
  },
  {
    url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=90",
    label: "Nosso Planeta Terra",
    desc: "porque o que fazemos hoje afetará o amanhã, na OCTA ENERGIA trabalhamos a mais de 10 anos em desenvolvimento de soluções"
  }
];

export default function EcoBanner() {
  const [playVideo, setPlayVideo] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [isSlidingPaused, setIsSlidingPaused] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Automatic sliding transition with 3 seconds of still pause + slow move
  React.useEffect(() => {
    if (isSlidingPaused) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500); // 3000ms pause + 1500ms slow slide duration
    return () => clearInterval(interval);
  }, [isSlidingPaused]);

  const narrativePillars = [
    {
      title: "Filosofia & Mudança",
      subtitle: "Crescer é adaptar-se",
      icon: <Globe className="w-5 h-5 text-cyan-400" />,
      text: "Crescer é aprender, crescer é superar-se a cada dia, crescer é adaptar-se às mudanças, e o mundo está mudando, e nós estamos mudando. Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos.",
      highlight: "Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade, porque o que fazemos hoje afetará o amanhã."
    },
    {
      title: "Compromisso OCTA",
      subtitle: "Mais de 10 anos de soluções",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      text: "Na OCTA ENERGIA trabalhamos a mais de 10 anos em desenvolvimento de soluções para enfrentar esse compromisso, melhorando os nossos projetos para reduzir os impactos deixados por outras matrizes energéticas e suas consequências.",
      highlight: "Aprimoramos o nosso sistema de geração e produção de energia elétrica para entregar autonomia estável de base load."
    },
    {
      title: "A Revolução GAEL",
      subtitle: "Gerador Autossustentável de Energia Limpa",
      icon: <Cpu className="w-5 h-5 text-[#f2ff00]" />,
      text: "Criamos geradores magnéticos cinéticos: o GAEL (Gerador Autossustentável de Energia Limpa). Com o advento do descobrimento de terras raras e as inteligências artificiais, unindo com estudos refinados de cinética e mecânica apurada, incessantes pesquisas e o aprimoramento dos nossos equipamentos.",
      highlight: "O GAEL é o ápice da engenharia cinética-magnética moderna, gerando energia de forma contínua e sustentável."
    },
    {
      title: "Impacto & Futuro",
      subtitle: "Crescer com responsabilidade",
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      text: "Crescemos e ajudamos outras empresas a crescer, a serem mais rentáveis com responsabilidade social e meio ambiental. Seguimos aprendendo e formando o nosso pessoal e o dos nossos clientes em vários países do mundo.",
      highlight: "Somos altamente qualificados apaixonados pelo que fazemos projetamos, fabricamos, instalamos e colocamos em marcha geradores magnéticos Cinéticos. Na OCTA ENERGIA, olhamos para o futuro."
    }
  ];

  return (
    <div id="essencia-geracao" className="w-full bg-gradient-to-b from-[#080c16] via-[#050810] to-[#080c16] border-b border-t border-white/5 py-24 relative overflow-hidden font-sans">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#f2ff00]/5 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#f2ff00]/10 border border-[#f2ff00]/25 rounded-full text-[11px] font-mono font-bold text-[#f2ff00] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#f2ff00] animate-pulse" />
            <span>A Essência da Nossa Geração</span>
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Tecnologia GAEL e o Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f2ff00] via-emerald-400 to-cyan-400">Compromisso com o Futuro</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Na OCTA ENERGIA, desenvolvemos tecnologia cinética-magnética limpa com inteligência artificial para construir um amanhã autossustentável e próspero.
          </p>
        </div>

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: GAEL Technology Showcase Card (No Video) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
              {/* Background ambient light */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f2ff00]/5 blur-[60px] pointer-events-none rounded-full" />

              {/* Main Visual Image & Emblem */}
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/5 bg-slate-950 shadow-inner group">
                <img 
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=90" 
                  alt="OCTA Energia clean technology" 
                  className="w-full h-full object-cover filter brightness-[0.55] group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Center Branding Watermark: Octa Energia, compromisso com o planeta */}
                <div className="absolute top-[38%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#f2ff00]/20 text-center pointer-events-none w-[90%] max-w-sm z-10 shadow-2xl">
                  <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    OCTA Energia clean technology
                  </p>
                  <p className="text-white text-xs font-semibold tracking-wide mt-1 drop-shadow-sm font-sans">
                    Octa Energia, compromisso com o planeta
                  </p>
                </div>

                {/* Embedded Specs Overlaid */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/70 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10 z-10 shadow-lg">
                  <div>
                    <h4 className="text-xs font-bold text-white font-mono tracking-wider">GAEL CORE ENGINE</h4>
                    <span className="text-[9px] text-slate-300 leading-none block mt-0.5 font-sans">Sincronismo Magnético Indutivo</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#f2ff00] font-mono font-bold block tracking-wider">100% BASE LOAD</span>
                    <span className="text-[9px] text-slate-300 block mt-0.5 font-sans">Operação Ininterrupta</span>
                  </div>
                </div>
              </div>

              {/* Technical Blueprint Elements Grid */}
              <div className="grid grid-cols-2 gap-3.5 relative z-10">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#f2ff00]">
                    <Cpu className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Inteligência Artificial</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Algoritmos de IA otimizam constantemente os campos de indução magnética sob demanda.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Terras Raras</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Utilização avançada de neodímio e ligas de alta saturação para máxima densidade de fluxo.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <Leaf className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Cinética & Mecânica</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Estudos cinéticos refinados e mecânica de alta precisão com perdas por atrito reduzidas a zero.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/5 space-y-1">
                  <div className="flex items-center space-x-1.5 text-indigo-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-wider font-mono">Autossustentável</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Independente de intempéries climáticas, sem necessidade de vento, sol ou combustão.
                  </p>
                </div>
              </div>

              {/* Eco Certification Banner */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center space-x-3.5 relative z-10">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-white text-xs block">Matriz de Emissão Zero de Carbono</span>
                  <p className="text-[10px] text-slate-400">
                    Aprovado nos padrões globais de ESG e sustentabilidade ambiental industrial.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Immersive Narrative Engine */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Top Interactive Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {narrativePillars.map((pillar, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePillar(idx)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[84px] ${
                    activePillar === idx 
                      ? "bg-slate-900 border-emerald-500/30 text-white shadow-lg" 
                      : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                  }`}
                >
                  <span className="mb-1.5">{pillar.icon}</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block leading-none">
                    {pillar.title.split(" ")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-xl space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePillar}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Pillar Title Block */}
                  <div className="flex items-center space-x-2.5 pb-4 border-b border-white/5">
                    <div className="p-2 bg-slate-950 rounded-lg border border-white/10">
                      {narrativePillars[activePillar].icon}
                    </div>
                    <div>
                      <span className="text-[10px] text-[#f2ff00] font-mono font-bold uppercase tracking-widest block">
                        {narrativePillars[activePillar].subtitle}
                      </span>
                      <h3 className="text-lg font-bold text-white font-display leading-none mt-1">
                        {narrativePillars[activePillar].title}
                      </h3>
                    </div>
                  </div>

                  {/* Narrative Body Text */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {narrativePillars[activePillar].text}
                  </p>

                  {/* Impact callout box */}
                  <div className="p-4 rounded-xl bg-[#f2ff00]/5 border border-[#f2ff00]/15 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5">
                      <Sparkles className="w-16 h-16 text-[#f2ff00]" />
                    </div>
                    <span className="text-[9.5px] text-[#f2ff00] font-mono font-extrabold uppercase tracking-widest block mb-1">
                      IMPACTO & COMPROMISSO
                    </span>
                    <p className="text-white text-xs font-medium leading-relaxed">
                      {narrativePillars[activePillar].highlight}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Seamless Full-Length Narrative Overview */}
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5 flex items-center">
                  <Leaf className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                  Manifesto OCTA ENERGIA
                </h4>
                <div className="space-y-3.5 text-xs text-slate-400 leading-relaxed font-sans">
                  <p>
                    <strong className="text-white">Crescer é aprender</strong>, crescer é superar-se a cada dia, crescer é adaptar-se as mudanças, o mundo está mudando, nós estamos mudando. Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos. Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade, porque o que fazemos hoje afetará o amanhã.
                  </p>
                  <p>
                    Na <strong className="text-emerald-400">OCTA ENERGIA</strong> trabalhamos a mais de 10 anos em desenvolvimento de soluções para enfrentar esse compromisso, melhorando os nossos projetos para reduzir os impactos deixados por outras matrizes energéticas, e suas consequências.
                  </p>
                  <p>
                    Temos aprimorado o nosso sistema de geração, de produção de energia elétrica a partir do gerador magnético cinético. Com o advento do descobrimento de terras raras e as inteligências artificiais, unindo com estudos refinados de cinética e mecânica apurada, incessantes pesquisas e o aprimoramento dos nossos equipamentos, criamos geradores magnéticos cinéticos: o <strong className="text-[#f2ff00]">GAEL (Gerador Autossustentável de Energia Limpa)</strong>.
                  </p>
                  <p>
                    Crescemos e ajudamos outras empresas a crescer, a serem mais rentáveis com responsabilidade, responsabilidade social e meio ambiental. Seguimos aprendendo e formando o nosso pessoal e o dos nossos clientes, em vários países do mundo. Somos um pessoal apaixonado e orgulhoso pelo seu trabalho que desenha, fabrica, instala e põe em marcha os seus geradores. Profissionais altamente qualificados, capazes de construir projetos personalizados segundo as necessidades de cada um. Na <strong className="text-cyan-400">OCTA ENERGIA</strong>, olhamos para o futuro.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Cinematic Automatic & Manual Sliding Image Showcase */}
      <div className="mt-20 border-t border-white/5 pt-16 pb-12 relative overflow-hidden bg-gradient-to-b from-transparent to-[#04060c]/60">
        
        {/* Subtle glowing lines */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#f2ff00]/10 to-transparent" />

        {/* Header displaying the core quote and slide controls */}
        <div className="max-w-4xl mx-auto px-4 text-center mb-8 relative z-10 flex flex-col items-center">
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-serif italic text-lg sm:text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-white/70 tracking-wide leading-relaxed font-medium"
          >
            “Crescer é aprender, crescer é superar-se a cada dia.”
          </motion.p>
          <div className="w-16 h-[1px] bg-emerald-400/30 mt-4 mb-5" />

          {/* Interactive Play/Pause & Counter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsSlidingPaused(!isSlidingPaused)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-xs font-mono font-bold transition duration-300 hover:scale-105 active:scale-95 ${
                isSlidingPaused 
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              }`}
            >
              {isSlidingPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Iniciar Slides Automáticos</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pausar Slides Automáticos</span>
                </>
              )}
            </button>
            
            <span className="text-xs font-mono text-cyan-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-full flex items-center space-x-1.5 shadow-md">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>Figura {carouselIndex + 1} de {carouselImages.length}</span>
            </span>

            <span className="text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 px-3 py-2 rounded-full hidden sm:inline-block">
              {isSlidingPaused ? "⏸️ Pausado para leitura" : "⏱️ Pausa de 3s por figura • Movimento lento"}
            </span>
          </div>
        </div>

        {/* Enlarged Carousel Frame with cinematic slides */}
        <div className="relative w-full max-w-5xl mx-auto px-4 select-none">
          {/* Main Visual Window Frame */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] h-[320px] sm:h-[420px] md:h-[500px] lg:h-[560px]">
            
            {/* Horizontal sliding container */}
            <motion.div
              className="flex h-full w-full"
              animate={{ x: `-${carouselIndex * 100}%` }}
              transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }} // Elegant, slower smooth slide duration
            >
              {carouselImages.map((slide, index) => (
                <div 
                  key={`${slide.label}-${index}`}
                  className="w-full h-full flex-shrink-0 relative overflow-hidden group"
                >
                  {/* High Quality Cinematic Image with Enhanced Brightness & Sharpness */}
                  <img
                    src={slide.url}
                    alt={slide.label}
                    loading="lazy"
                    className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05] saturate-[1.02] transition-all duration-1000 group-hover:scale-[1.03]"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Highly optimized, subtle soft vignette bottom gradient to preserve maximum image illumination */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent pointer-events-none" />

                  {/* Elegant floating information bar */}
                  <div className="absolute bottom-6 inset-x-6 sm:bottom-8 sm:inset-x-8 text-left bg-black/50 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10 max-w-2xl shadow-xl transition-all duration-300">
                    <p className="text-xs font-mono font-bold text-[#f2ff00] uppercase tracking-widest drop-shadow-md mb-1.5 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#f2ff00]" />
                      <span>{slide.label}</span>
                    </p>
                    <p className="text-white text-sm sm:text-base leading-relaxed font-sans font-medium">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Gradient edge overlays for smooth blend */}
            <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950/30 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950/30 to-transparent pointer-events-none" />

            {/* Manual Navigation Arrows */}
            <button 
              onClick={() => {
                setIsSlidingPaused(true);
                setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-slate-950 border border-white/10 hover:border-white/30 text-white transition-all duration-300 backdrop-blur-md z-20 group"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform text-[#f2ff00]" />
            </button>
            <button 
              onClick={() => {
                setIsSlidingPaused(true);
                setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-slate-950 border border-white/10 hover:border-white/30 text-white transition-all duration-300 backdrop-blur-md z-20 group"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform text-[#f2ff00]" />
            </button>

            {/* Dot indicators at the bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/5 z-20">
              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsSlidingPaused(true);
                    setCarouselIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === carouselIndex ? "bg-[#f2ff00] w-3.5" : "bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Ir para slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
