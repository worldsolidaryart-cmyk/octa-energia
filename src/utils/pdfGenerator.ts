import { jsPDF } from "jspdf";
import { generatorsData } from "../data";

interface PDFData {
  power: number;
  tariff: number;
  uptime: number;
  monthlyKwh: number;
  monthlySavings: number;
  annualSavings: number;
  payback: number;
  trees: number;
  strategy?: "venda" | "locacao";
  escoDiscount?: number;
  monthlyBill?: number;
  customerName?: string;
  customerCompany?: string;
  generatorName?: string;
  isOffGrid?: boolean;
}

export function generateFinancialPDF({
  power,
  tariff,
  uptime,
  monthlyKwh,
  monthlySavings,
  annualSavings,
  payback,
  trees,
  strategy = "venda",
  escoDiscount = 20,
  monthlyBill = 0,
  customerName = "Default Corporate",
  customerCompany = "Empresa Cliente",
  generatorName = "OCTA Gerador Cinético",
  isOffGrid = false,
}: PDFData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const formatCurrency = (val: number) => {
    return "R$ " + Math.round(val).toLocaleString("pt-BR");
  };

  const formatNumber = (val: number) => {
    return Math.round(val).toLocaleString("pt-BR");
  };

  const getGeneratorPrice = (p: number) => {
    if (p <= 100) return 1250000;
    if (p <= 150) return 1450000;
    if (p <= 250) return 1900000;
    if (p <= 300) return 2300000;
    if (p <= 500) return 3500000;
    return 6500000; // 1MW
  };

  // --- PAGE CONFIGURATIONS & THEME COLORS ---
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;

  const colorDarkNavy = [10, 25, 47]; // Deep header navy background
  const colorAccentYellow = [242, 255, 0]; // Neon Yellow
  const colorCyan = [0, 180, 216]; // Accent Cyan
  const colorTextDark = [30, 41, 59]; // Off-black
  const colorTextMuted = [100, 116, 139]; // Muted grey
  const colorBgLightGray = [248, 250, 252]; // Clean card backgrounds
  const colorBgSuccess = [240, 253, 244]; // Light green SVG/carbon block
  const colorSuccessBorder = [187, 247, 208];

  const dateStr = new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  // ==========================================
  // PAGE 1: EXECUTIVE SUMMARY & FINANCIALS
  // ==========================================
  let currentY = 15;

  // Header Title Bar
  doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 28, "F");

  // Yellow Accent Line under header
  doc.setFillColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.rect(margin, currentY + 28, pageWidth - margin * 2, 1.5, "F");

  // Logo Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("OCTA ENERGIA", margin + 8, currentY + 10);

  // Logo Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(242, 255, 0);
  doc.text("SOLUÇÕES EM ENERGIA LIMPA", margin + 8, currentY + 15);

  // Group Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(190, 200, 215);
  doc.text("Grupo VALLEC PARTICIPAÇÕES", margin + 8, currentY + 20);

  // Document Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.text("ESTUDO DE VIABILIDADE TÉCNICO-FINANCEIRO", pageWidth - margin - 8, currentY + 11, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(230, 240, 255);
  doc.text(`Identificador: EST-OCTA-PRP-${power}kW | ${dateStr}`, pageWidth - margin - 8, currentY + 18, { align: "right" });

  currentY += 38;

  // Recipient Card
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 18, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, pageWidth - margin * 2, 18, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("DESTINATÁRIO CORPORATIVO:", margin + 6, currentY + 6);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
  doc.text(`Cliente: ${customerName}`, margin + 6, currentY + 12);
  doc.text(`Empresa: ${customerCompany}`, margin + 80, currentY + 12);

  doc.setFont("helvetica", "bold");
  doc.text("MODELO COMERCIAL:", margin + 145, currentY + 6);
  if (isOffGrid) {
    doc.setTextColor(0, 168, 150);
    doc.text("Híbrido Off-Grid + BESS", margin + 145, currentY + 12);
  } else {
    doc.setTextColor(strategy === "locacao" ? 0 : 79, strategy === "locacao" ? 180 : 70, strategy === "locacao" ? 216 : 229);
    doc.text(strategy === "locacao" ? `Locação (ESCO) - ${escoDiscount}% Desc.` : "Compra (Venda Direta)", margin + 145, currentY + 12);
  }

  currentY += 24;

  // Executive Summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("1. Resumo Executivo", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);

  let introText = "";
  if (isOffGrid) {
    introText = `A OCTA ENERGIA, integrante do Grupo VALLEC PARTICIPAÇÕES, apresenta este estudo de viabilidade para solução autônoma híbrido Base Load e baterias de lítio de alta performance (BESS) sob o gerador: ${generatorName}. A solução visa atender e estabilizar plantas produtivas que necessitam de 100% de confiabilidade energética (fator de carga de ${uptime}%), superando de forma definitiva as sazonalidades limitantes e flutuações de vento ou sol de fontes alternativas convencionais. O sistema GAEL atua como o motor de recarga principal ou alimentador contínuo de cargas pesadas offline, eliminando a dependência de diesel fóssil.`;
  } else if (strategy === "locacao") {
    introText = `A OCTA ENERGIA, integrante do Grupo VALLEC PARTICIPAÇÕES, apresenta este estudo de viabilidade sob a modalidade de Contrato de Locação (ESCO - Energia como Serviço) utilizando o gerador modelo: ${generatorName}. Sua empresa não investe capital de aquisição (CAPEX = Zero). Nós projetamos, fabricamos, transportamos e comissionamos o rotor magnético cinético. O faturamento de energia da OCTA ENERGIA possui um desconto garantido de ${escoDiscount}% em relação à tarifa da sua distribuidora local. Essa operação melhora imediatamente as margens líquidas (EBITDA) da planta de forma verde e auto-financiada.`;
  } else {
    introText = `A OCTA ENERGIA, integrante do Grupo VALLEC PARTICIPAÇÕES, apresenta esta proposta comercial para aquisição direta de ativo base load sob o gerador modelo: ${generatorName}. Operando de forma contínua com fator de carga em ${uptime}%, este projeto concede independência de fornecimento, blindagem de tarifas e eliminação completa de custos de horário de ponta. O rotor cinético assistido por neodímio proporciona recuperação de investimento ágil, combinando a máxima segurança produtiva à agenda corporativa de descarbonização (ESG).`;
  }

  const splitIntro = doc.splitTextToSize(introText, pageWidth - margin * 2);
  doc.text(splitIntro, margin, currentY);
  currentY += splitIntro.length * 4.5 + 4;

  // Simulator Inputs / Selected parameters
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("2. Parâmetros Selecionados para a Simulação", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 7;

  // Inputs Frame
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 18, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, pageWidth - margin * 2, 18, "S");

  const boxWidth = (pageWidth - margin * 2) / 3;

  // Col 1: Potência
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("POTÊNCIA REQUERIDA", margin + 6, currentY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text(`${power} kW`, margin + 6, currentY + 12);

  // Col 2: Tarifa
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("TARIFA DA CONCESSIONÁRIA", margin + boxWidth + 6, currentY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text(`R$ ${tariff.toFixed(2)} / kWh`, margin + boxWidth + 6, currentY + 12);

  // Col 3: Fator Carga
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("FATOR DE CARGA (UPTIME)", margin + boxWidth * 2 + 6, currentY + 6);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text(`${uptime}%`, margin + boxWidth * 2 + 6, currentY + 12);

  currentY += 24;

  // Financial Outputs Cards
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("3. Viabilidade Econômico-Financeira", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 7;

  // Grid structure for 4 cards
  const gridW = (pageWidth - margin * 2 - 4) / 2;
  const gridH = 18;

  // Card 1
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin, currentY, gridW, gridH, "F");
  doc.rect(margin, currentY, gridW, gridH, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("GERAÇÃO ESTIMADA MENSAL", margin + 6, currentY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text(`${formatNumber(monthlyKwh)} kWh`, margin + 6, currentY + 12.5);

  // Card 2
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin + gridW + 4, currentY, gridW, gridH, "F");
  doc.rect(margin + gridW + 4, currentY, gridW, gridH, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("ECONOMIA FINANCEIRA DE BASE (MÊS)", margin + gridW + 10, currentY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(21, 128, 61); // green
  doc.text(formatCurrency(monthlySavings), margin + gridW + 10, currentY + 12.5);

  currentY += gridH + 3.5;

  // Card 3
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin, currentY, gridW, gridH, "F");
  doc.rect(margin, currentY, gridW, gridH, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("ECONOMIA DE ESCALA PROJETADA (ANO)", margin + 6, currentY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorCyan[0], colorCyan[1], colorCyan[2]);
  doc.text(formatCurrency(annualSavings), margin + 6, currentY + 12.5);

  // Card 4
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin + gridW + 4, currentY, gridW, gridH, "F");
  doc.rect(margin + gridW + 4, currentY, gridW, gridH, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("PRAZO ESTIMADO DE AMORTIZAÇÃO", margin + gridW + 10, currentY + 5.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text(strategy === "locacao" ? "Imediato (Investimento ZERO)" : `${payback} a ${payback + 4} Meses`, margin + gridW + 10, currentY + 12.5);

  currentY += gridH + 6;

  // Detailed Table Projections (5 Years)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("4. Projeções de Fluxo de Caixa Acumuladas (5 Anos)", margin, currentY);

  currentY += 4;

  // Table Headers
  doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 7, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("ANO", margin + 4, currentY + 5);
  doc.text("POTÊNCIA DE OPERAÇÃO (kW)", margin + 28, currentY + 5);
  doc.text("Conversão Acumulada de Energia (kWh)", margin + 82, currentY + 5);
  doc.text("ECONOMIA ACUMULADA", pageWidth - margin - 4, currentY + 5, { align: "right" });

  currentY += 7;

  // Five years values zebra table
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  for (let year = 1; year <= 5; year++) {
    // Zebra background
    if (year % 2 === 0) {
      doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
      doc.rect(margin, currentY, pageWidth - margin * 2, 6.5, "F");
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 6.5, pageWidth - margin, currentY + 6.5);

    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    doc.text(`Ano 0${year}`, margin + 4, currentY + 4.5);
    doc.text(`${power} kW`, margin + 28, currentY + 4.5);

    const kwhAccum = monthlyKwh * 12 * year;
    doc.text(`${formatNumber(kwhAccum)} kWh`, margin + 82, currentY + 4.5);

    const moneyAccum = annualSavings * year;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 128, 61); // deep green
    doc.text(formatCurrency(moneyAccum), pageWidth - margin - 4, currentY + 4.5, { align: "right" });

    doc.setFont("helvetica", "normal");
    currentY += 6.5;
  }

  // Bottom footer page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Este material é propriedade intelectual ativa da OCTA ENERGIA integrada ao Grupo VALLEC PARTICIPAÇÕES.", margin, pageHeight - 12);
  doc.setFont("helvetica", "bold");
  doc.text("Página 1 de 2", pageWidth - margin, pageHeight - 12, { align: "right" });


  // ==========================================
  // PAGE 2: TECHNICAL DETAILS, COMMERCIAL terms & SIGNATURES
  // ==========================================
  doc.addPage();
  currentY = 15;

  // Navy banner on second page
  doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 14, "F");
  
  doc.setFillColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.rect(margin, currentY + 14, pageWidth - margin * 2, 1, "F");

  // Logo text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("OCTA ENERGIA", margin + 6, currentY + 8.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(242, 255, 0);
  doc.text("SOLUÇÕES EM ENERGIA LIMPA  |", margin + 33, currentY + 8.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ESPECIFICAÇÕES & CONDIÇÕES COMERCIAIS", pageWidth - margin - 6, currentY + 8.5, { align: "right" });

  currentY += 21;

  // 5. Technical specs
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("5. Ficha Técnica do Equipamento (Sistema GAEL Autônomo)", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 7;

  // Gray Tech Sheet card
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 36, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, pageWidth - margin * 2, 36, "S");

  // Draw 2 column key-value bullet points with smaller crisp typography
  const leftX = margin + 5;
  const rightX = margin + 98;

  // Line 1 Left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
  doc.text("• Princípio de Funcionamento:", leftX, currentY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Indução eletromecânica assistida magneticamente por rotor oscilante.", leftX + 4, currentY + 9.5);

  // Line 1 Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("• Elementos Ativos de Excitação:", rightX, currentY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Magnetos permanentes cilíndricos sinterizados de Neodímio (NdFeB).", rightX + 4, currentY + 9.5);

  // Line 2 Left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("• Eficiência Energética Global:", leftX, currentY + 15.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Excelente rendimento elétrico-mecânico estável (> 97% na conversão física).", leftX + 4, currentY + 19.5);

  // Line 2 Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("• Atenuação Acústica & Térmica:", rightX, currentY + 15.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Carenagem de alta selagem com níveis reduzidos de ruído (< 55 dBA a 7m).", rightX + 4, currentY + 19.5);

  // Line 3 Left
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("• Tecnologia de Sincronismo:", leftX, currentY + 25.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Painel eletrônico integrado para sincronismo Smart Grid, micro-redes ou BESS.", leftX + 4, currentY + 29.5);

  // Line 3 Right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("• Emissões Diretas e Pegada de Carbono:", rightX, currentY + 25.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("Carbono Neutro (livre de queima de diesel, gás ou lubrificação combustível).", rightX + 4, currentY + 29.5);

  currentY += 42;

  // 6. Commercial terms & Pricing
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("6. Orçamento Comercial & Condições Contratuais", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 7;

  // Commercial terms Box
  doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 32, "F");
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, pageWidth - margin * 2, 32, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);

  doc.text(`MODALIDADE ATIVA DE CONTRATAÇÃO: ${strategy === "locacao" ? "LOCAÇÃO DE ATIVO (CONTRATO ESCO / PPA)" : "COMPRA E VENDA DIRETA (ATIVO PRÓPRIO)"}`, margin + 5, currentY + 6);
  
  doc.setDrawColor(241, 190, 0);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);

  const priceVal = getGeneratorPrice(power);

  if (strategy === "locacao") {
    doc.text(`• Investimento Inicial de Aquisição (CAPEX):`, margin + 6, currentY + 12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 128, 61);
    doc.text("ISENTO - R$ 0,00 (ZERO CAPEX CORPORATIVO)", margin + 74, currentY + 12);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    doc.text(`• Tarifa Aplicada Estimada da ESCO:`, margin + 6, currentY + 17);
    const rentalTarif = tariff * (1 - escoDiscount / 100);
    doc.setFont("helvetica", "bold");
    doc.text(`R$ ${rentalTarif.toFixed(3)} / kWh`, margin + 74, currentY + 17);

    doc.setFont("helvetica", "normal");
    doc.text(`• Operação, Manutenção & Seguro (O&M):`, margin + 6, currentY + 22);
    doc.setFont("helvetica", "bold");
    doc.text("Inclusos 100% no encargo mensal e sob responsabilidade total da OCTA ENERGIA.", margin + 74, currentY + 22);
    
    doc.setFont("helvetica", "normal");
    doc.text(`• Prazo de Vigência Contratual Padrão:`, margin + 6, currentY + 27);
    doc.setFont("helvetica", "bold");
    doc.text(`60 Meses (com garantia física de entrega de energia limpa com desconto).`, margin + 74, currentY + 27);
  } else {
    doc.text(`• Investimento Nominal para Implantação (CAPEX):`, margin + 6, currentY + 12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(190, 70, 70);
    doc.text(`${formatCurrency(priceVal)},00`, margin + 74, currentY + 12);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    doc.text(`• Garantia Geral do Equipamento GAEL:`, margin + 6, currentY + 17);
    doc.setFont("helvetica", "bold");
    doc.text("05 Anos (60 meses) de garantia estrutural ativa do rotor e magnetos.", margin + 74, currentY + 17);

    doc.setFont("helvetica", "normal");
    doc.text(`• Manutenção Técnica Preventiva Periódica:`, margin + 6, currentY + 22);
    doc.setFont("helvetica", "bold");
    doc.text("Inclusa de forma gratuita por 12 meses. Pacote O&M opcional pós este período.", margin + 74, currentY + 22);

    doc.setFont("helvetica", "normal");
    doc.text(`• Condições de Faturamento & Pagamento:`, margin + 6, currentY + 27);
    doc.setFont("helvetica", "bold");
    doc.text("50% de sinal de engenharia, 50% na saída da fábrica e ativação definitiva.", margin + 74, currentY + 27);
  }

  currentY += 38;

  // 7. Schedule
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("7. Cronograma Clássico de Manufatura e Ativação", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 7;

  // Table header schedule
  doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.rect(margin, currentY, pageWidth - margin * 2, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text("ETAPA DO PROCESSO", margin + 4, currentY + 4.2);
  doc.text("PRAZO ESTIMADO", margin + 85, currentY + 4.2);
  doc.text("ATIVIDADES e MARCOS DO COMPROMISSO", pageWidth - margin - 4, currentY + 4.2, { align: "right" });

  currentY += 6;

  // Rows
  const schedule = [
    { name: "Etapa 01 - Projeto & Engenharia Executiva", days: "20 dias", tasks: "Desenho executivo, calibragem de carga local e adequação civil." },
    { name: "Etapa 02 - Manufatura & Testes de Bancada", days: "60 dias", tasks: "Bobinamento elétrico assistido, montagem do rotor de neodímio." },
    { name: "Etapa 03 - Ativação, Conectividade e Entrega", days: "15 dias", tasks: "Logística pesada, montagem de intersincronismo, comissionamento." }
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);

  schedule.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
      doc.rect(margin, currentY, pageWidth - margin * 2, 6, "F");
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 6, pageWidth - margin, currentY + 6);

    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    doc.text(row.name, margin + 4, currentY + 4.2);
    doc.text(row.days, margin + 85, currentY + 4.2);
    doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
    doc.text(row.tasks, pageWidth - margin - 4, currentY + 4.2, { align: "right" });

    currentY += 6;
  });

  currentY += 12;

  // 8. Signatures Block
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("8. Validação de Proposta e Painel de Assinaturas", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 16;

  // Signature lines
  const sigLineW = 68;
  const sigLeftX = margin + 10;
  const sigRightX = pageWidth - margin - sigLineW - 10;

  // Draw lines
  doc.setDrawColor(140, 150, 170);
  doc.setLineWidth(0.2);
  doc.line(sigLeftX, currentY, sigLeftX + sigLineW, currentY);
  doc.line(sigRightX, currentY, sigRightX + sigLineW, currentY);

  // Line texts
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("OCTA ENERGIA LTDA", sigLeftX + sigLineW / 2, currentY + 4.2, { align: "center" });
  doc.text(`REPRESENTANTE: ${customerCompany.toUpperCase()}`, sigRightX + sigLineW / 2, currentY + 4.2, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Divisão de Engenharia de Base", sigLeftX + sigLineW / 2, currentY + 7.5, { align: "center" });
  doc.text("Responsável Técnico / Diretor Corporativo", sigRightX + sigLineW / 2, currentY + 7.5, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.text("Grupo VALLEC PARTICIPAÇÕES S.A.", sigLeftX + sigLineW / 2, currentY + 11, { align: "center" });
  doc.text("Assinatura do Responsável e Data", sigRightX + sigLineW / 2, currentY + 11, { align: "center" });

  // 9. Sustainability Block (ESG) - Deslocado para o rodapé da página
  const esgY = 222;

  doc.setFillColor(colorBgSuccess[0], colorBgSuccess[1], colorBgSuccess[2]);
  doc.rect(margin, esgY, pageWidth - margin * 2, 13, "F");
  doc.setDrawColor(colorSuccessBorder[0], colorSuccessBorder[1], colorSuccessBorder[2]);
  doc.rect(margin, esgY, pageWidth - margin * 2, 13, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61);
  doc.text("CERTIFICADO PROJETADO DE DESCARBONIZAÇÃO ESG", margin + 6, esgY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(34, 110, 48);
  const ecoText = `Instalar o sistema magnético cinético autônomo OCTA substitui diretamente frotas de geradores fósseis nocivos. O impacto ambiental positivo acumulado do seu projeto de ${power} kW equivale ao plantio anual garantido de ${formatNumber(trees)} árvores nativas em florestas comerciais e de recomposição.`;
  const splitEco = doc.splitTextToSize(ecoText, pageWidth - margin * 2 - 12);
  doc.text(splitEco, margin + 6, esgY + 8.5);

  // ESG Seals below the Green Box
  const sealsY = esgY + 18;
  const sealW = 56;
  const sealH = 9;
  
  // Seal 1: Baixo Carbono
  const s1X = margin;
  doc.setFillColor(240, 253, 244);
  doc.rect(s1X, sealsY, sealW, sealH, "F");
  doc.setDrawColor(187, 247, 208);
  doc.setLineWidth(0.15);
  doc.rect(s1X, sealsY, sealW, sealH, "S");
  doc.setFillColor(34, 197, 94);
  doc.rect(s1X, sealsY, 2, sealH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(21, 128, 61);
  doc.text("BAIXO CARBONO", s1X + 4, sealsY + 3.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(110, 120, 139);
  doc.text("Selo de Carbono Zero Ativo", s1X + 4, sealsY + 6.8);

  // Seal 2: Energia Verde
  const s2X = margin + sealW + 6;
  doc.setFillColor(254, 254, 224);
  doc.rect(s2X, sealsY, sealW, sealH, "F");
  doc.setDrawColor(242, 252, 150);
  doc.rect(s2X, sealsY, sealW, sealH, "S");
  doc.setFillColor(234, 179, 8);
  doc.rect(s2X, sealsY, 2, sealH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(133, 110, 0);
  doc.text("ENERGIA VERDE", s2X + 4, sealsY + 3.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(110, 120, 139);
  doc.text("Inovação Cinética Limpa", s2X + 4, sealsY + 6.8);

  // Seal 3: Compliance ESG
  const s3X = margin + sealW * 2 + 12;
  doc.setFillColor(240, 249, 255);
  doc.rect(s3X, sealsY, sealW, sealH, "F");
  doc.setDrawColor(186, 230, 253);
  doc.rect(s3X, sealsY, sealW, sealH, "S");
  doc.setFillColor(14, 165, 233);
  doc.rect(s3X, sealsY, 2, sealH, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(3, 105, 161);
  doc.text("COMPLIANCE ESG", s3X + 4, sealsY + 3.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(110, 120, 139);
  doc.text("Governança Vallec Ativa", s3X + 4, sealsY + 6.8);

  // Page 2 footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  const legalDisclaimer = "* Este estudo formal apresenta estimativa prévia calculada pelo algoritmo corporativo do Grupo VALLEC PARTICIPAÇÕES. Condições definitivas de engenharia civil local, transporte e comissionamento de cabines serão especificadas no parecer técnico final.";
  doc.text(legalDisclaimer, margin, pageHeight - 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Página 2 de 2", pageWidth - margin, pageHeight - 12, { align: "right" });

}

export function generateCatalogPDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;

  const colorDarkNavy = [10, 25, 47]; // Deep header navy background
  const colorAccentYellow = [242, 255, 0]; // Neon Yellow
  const colorCyan = [0, 180, 216]; // Accent Cyan
  const colorTextDark = [30, 41, 59]; // Off-black
  const colorTextMuted = [100, 116, 139]; // Muted grey
  const colorBgLightGray = [248, 250, 252]; // Clean card backgrounds

  const dateStr = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  // Helper for adding nice page headers
  const addPageHeader = (title: string) => {
    doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
    doc.rect(margin, 12, pageWidth - margin * 2, 14, "F");
    
    doc.setFillColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
    doc.rect(margin, 26, pageWidth - margin * 2, 0.8, "F");

    // Logo text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("OCTA ENERGIA", margin + 6, 21);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(242, 255, 0);
    doc.text("SOLUÇÕES EM ENERGIA LIMPA  |", margin + 33, 21);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), pageWidth - margin - 6, 21, { align: "right" });
  };

  // Helper for adding nice page footers
  const addPageFooter = (pageNum: number, totalPages: number) => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
    doc.text("Este catálogo é propriedade intelectual da OCTA ENERGIA integrada ao Grupo VALLEC PARTICIPAÇÕES S.A.", margin, pageHeight - 12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 12, { align: "right" });
  };

  // ==========================================
  // PAGE 1: COVER
  // ==========================================
  doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Decorative diagonal accent lines
  doc.setDrawColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.setLineWidth(1.5);
  doc.line(0, 45, pageWidth, 45);

  doc.setDrawColor(colorCyan[0], colorCyan[1], colorCyan[2]);
  doc.setLineWidth(0.8);
  doc.line(0, 49, pageWidth - 40, 49);

  // Big brand watermark background
  doc.setFont("helvetica", "bold");
  doc.setFontSize(72);
  doc.setTextColor(15, 33, 60);
  doc.text("OCTA", pageWidth / 2, 130, { align: "center" });

  // Main Titles
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.text("CATÁLOGO DE PRODUTOS CORPORATIVOS", margin + 4, 85);

  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text("SISTEMAS GAEL", margin + 4, 100);

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(colorCyan[0], colorCyan[1], colorCyan[2]);
  doc.text("Geradores Magnéticos Cinéticos Carenados", margin + 4, 110);

  doc.setFontSize(9.5);
  doc.setTextColor(210, 225, 240);
  const coverIntro = "A revolução na geração de energia de base (Base Load). Equipamentos 100% autônomos com emissão zero de carbono, baixo nível de ruído, projetados para independência energética de indústrias, comércios, data centers e agronegócio.";
  const coverIntroSplit = doc.splitTextToSize(coverIntro, pageWidth - margin * 2 - 10);
  doc.text(coverIntroSplit, margin + 4, 120);

  // Tech Specs Highlights on Cover
  doc.setFillColor(15, 33, 60);
  doc.rect(margin + 4, 150, pageWidth - margin * 2 - 8, 55, "F");
  doc.setDrawColor(colorCyan[0], colorCyan[1], colorCyan[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin + 4, 150, pageWidth - margin * 2 - 8, 55, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.text("DIFERENCIAIS OPERACIONAIS:", margin + 10, 158);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("• BASE LOAD CONTÍNUO: Operação 24 horas por dia, 7 dias por semana, com fator de carga constante.", margin + 10, 166);
  doc.text("• EMISSÃO ZERO: Sem queima de óleo diesel ou combustíveis fósseis. Ativo 100% verde.", margin + 10, 173);
  doc.text("• COMPLIANCE ESG: Redução direta e certificada da pegada de carbono da sua organização.", margin + 10, 180);
  doc.text("• ECONOMIA EXTREMA: Sem dependência climática (sol ou vento) e livre de custos tarifários de ponta.", margin + 10, 187);
  doc.text("• ISOLAMENTO ACÚSTICO: Carenagem selada e amortecimento antivibratório avançado.", margin + 10, 194);

  // Group / Footer on Cover
  doc.setDrawColor(255, 255, 255, 0.1);
  doc.setLineWidth(0.2);
  doc.line(margin, pageHeight - 35, pageWidth - margin, pageHeight - 35);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("OCTA ENERGIA S.A.", margin + 4, pageHeight - 27);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(190, 205, 225);
  doc.text("Grupo VALLEC PARTICIPAÇÕES S.A.", margin + 4, pageHeight - 22);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(colorAccentYellow[0], colorAccentYellow[1], colorAccentYellow[2]);
  doc.text(`Portfólio Oficial - Versão Atualizada: ${dateStr}`, pageWidth - margin - 4, pageHeight - 27, { align: "right" });
  doc.setTextColor(255, 255, 255);
  doc.text("Sede: BS DESIGN, Fortaleza - CE", pageWidth - margin - 4, pageHeight - 22, { align: "right" });

  // ==========================================
  // PAGE 2: MANIFESTO & INTRODUÇÃO DA TECNOLOGIA
  // ==========================================
  doc.addPage();
  let currentY = 36;
  addPageHeader("Tecnologia & Compromisso");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Manifesto OCTA ENERGIA", margin, currentY);

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(margin, currentY + 1.5, pageWidth - margin, currentY + 1.5);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);

  // Manifesto text
  const manifestoParagraphs = [
    "Crescer é aprender, crescer é superar-se a cada dia, crescer é adaptar-se as mudanças, o mundo está mudando, nós estamos mudando. Mudamos a forma de nos movermos, de nos entretermos, de nos relacionarmos. Muita exigência para um ecossistema que necessita de responsabilidade, nossa responsabilidade, porque o que fazemos hoje afetará o amanhã.",
    "Na OCTA ENERGIA trabalhamos a mais de 10 anos em desenvolvimento de soluções para enfrentar esse compromisso, melhorando os nossos projetos para reduzir os impactos deixados por outras matrizes energéticas, e suas consequências.",
    "Temos aprimorado o nosso sistema de geração, de produção de energia elétrica a partir do gerador magnético cinético. Com o advento do descobrimento de terras raras e as inteligências artificiais, unindo com estudos refinados de cinética e mecânica apurada, incessantes pesquisas e o aprimoramento dos nossos equipamentos, criamos geradores magnéticos cinéticos: o GAEL (Gerador Autossustentável de Energia Limpa).",
    "Crescemos e ajudamos outras empresas a crescer, a serem mais rentáveis com responsabilidade, responsabilidade social e meio ambiental. Seguimos aprendendo e formando o nosso pessoal e o dos nossos clientes, em vários países do mundo. Somos um pessoal apaixonado e orgulhoso pelo seu trabalho que desenha, fabrica, instala e põe em marcha os seus geradores. Profissionais altamente qualificados, capazes de construir projetos personalizados segundo as necessidades de cada um. Na OCTA ENERGIA, olhamos para o futuro."
  ];

  manifestoParagraphs.forEach((para) => {
    const splitPara = doc.splitTextToSize(para, pageWidth - margin * 2);
    doc.text(splitPara, margin, currentY);
    currentY += splitPara.length * 3.8 + 2.5;
  });

  currentY += 3;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("O Coração Tecnológico: Sistema GAEL", margin, currentY);
  doc.line(margin, currentY + 1.5, pageWidth - margin, currentY + 1.5);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
  
  const techText = "O GAEL (Gerador Autossustentável de Energia Limpa) baseia-se em indução eletromecânica assistida magneticamente por rotores oscilantes e magnetos sinterizados de Neodímio (NdFeB) de altíssimo magnetismo permanente. Trata-se de um sistema autônomo estável de fornecimento elétrico de base load que atua de forma independente ou hibridizada com bancos de baterias (BESS) e redes de distribuição locais. Sua altíssima eficiência global, combinada ao desgaste mecânico quase nulo e refrigeração forçada integrada, resulta em um ativo produtivo com retorno financeiro extremamente agressivo.";
  const splitTech = doc.splitTextToSize(techText, pageWidth - margin * 2);
  doc.text(splitTech, margin, currentY);

  currentY += splitTech.length * 3.8 + 8;

  // Add a neat highlight box for sustainable values
  doc.setFillColor(240, 253, 244);
  doc.rect(margin, currentY, pageWidth - margin * 2, 14, "F");
  doc.setDrawColor(187, 247, 208);
  doc.rect(margin, currentY, pageWidth - margin * 2, 14, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(21, 128, 61);
  doc.text("GOVERNANÇA AMBIENTAL & DE DESCARBONIZAÇÃO (ESG)", margin + 5, currentY + 4.5);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.8);
  doc.setTextColor(34, 110, 48);
  doc.text("Nossa tecnologia elimina 100% da queima contínua de diesel de geradores de emergência e mitiga as instabilidades das fontes solar e eólica,", margin + 5, currentY + 8.2);
  doc.text("entregando energia estável com absoluto respeito ao meio ambiente e responsabilidade com as futuras gerações.", margin + 5, currentY + 11.2);

  addPageFooter(2, 6);

  // ==========================================
  // PAGE 3: QUADRO COMPARATIVO DE VIABILIDADE ENERGÉTICA
  // ==========================================
  doc.addPage();
  currentY = 36;
  addPageHeader("Quadro de Viabilidade");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Quadro Comparativo de Viabilidade Energética", margin, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Limitações físicas e operacionais das tecnologias tradicionais de geração versus o Sistema Magnético Cinético OCTA.", margin, currentY + 4);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);
  currentY += 9;

  // Table setup
  const tableW = pageWidth - margin * 2;
  const colW1 = 38;
  const colWOther = (tableW - colW1) / 4;

  // Table Header
  doc.setFillColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.rect(margin, currentY, tableW, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.8);
  doc.setTextColor(255, 255, 255);
  doc.text("Indicador de Viabilidade", margin + 3, currentY + 5.5);
  
  doc.setTextColor(242, 255, 0); // Octa indicator
  doc.text("Gerador Magnético OCTA", margin + colW1 + 1, currentY + 5.5);
  
  doc.setTextColor(255, 255, 255);
  doc.text("Solar Fotovoltaico", margin + colW1 + colWOther + 1, currentY + 5.5);
  doc.text("Eólica Industrial", margin + colW1 + colWOther * 2 + 1, currentY + 5.5);
  doc.text("Gerador a Diesel", margin + colW1 + colWOther * 3 + 1, currentY + 5.5);

  currentY += 8;

  // Table rows
  const compRows = [
    {
      ind: "Disponibilidade Operacional",
      octa: "98% a 100% (Contínuo)",
      solar: "~25% (Apenas diurno)",
      wind: "~35% (Vento dep.)",
      diesel: "Emergencial (Demanda)"
    },
    {
      ind: "Dependência Climática",
      octa: "Zero (Independente)",
      solar: "Alta (Nuvens/Noite)",
      wind: "Alta (Sem vento = Parada)",
      diesel: "Zero (Requer combust.)"
    },
    {
      ind: "Área de Implantação / MW",
      octa: "Ultra compacta (< 20m²)",
      solar: "Extensa (10.000m²+)",
      wind: "Média-Extensa",
      diesel: "Compacta (~30m²)"
    },
    {
      ind: "Custo de Operação",
      octa: "Zero (Magnético Assistido)",
      solar: "Zero",
      wind: "Zero",
      diesel: "Crítico (Combustão cont.)"
    },
    {
      ind: "Pegada de Carbono (ESG)",
      octa: "Absoluto Zero Emissões",
      solar: "Zero na geração",
      wind: "Zero na geração",
      diesel: "Altíssima (Poluição direta)"
    },
    {
      ind: "Viabilidade Isolada (Off-Grid)",
      octa: "Excelente (Sem custo rede)",
      solar: "Requer BESS robusto",
      wind: "Requer BESS robusto",
      diesel: "Inviável a longo prazo"
    }
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);

  compRows.forEach((row, idx) => {
    // Row background
    if (idx % 2 === 1) {
      doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
      doc.rect(margin, currentY, tableW, 7.5, "F");
    }
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, currentY + 7.5, pageWidth - margin, currentY + 7.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    doc.text(row.ind, margin + 3, currentY + 5);

    // OCTA details in Green
    doc.setFont("helvetica", "bold");
    doc.setTextColor(21, 128, 61);
    doc.text(row.octa, margin + colW1 + 1, currentY + 5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    doc.text(row.solar, margin + colW1 + colWOther + 1, currentY + 5);
    doc.text(row.wind, margin + colW1 + colWOther * 2 + 1, currentY + 5);
    doc.text(row.diesel, margin + colW1 + colWOther * 3 + 1, currentY + 5);

    currentY += 7.5;
  });

  currentY += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Análise Técnica de Integração", margin, currentY);
  
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 1.5, pageWidth - margin, currentY + 1.5);
  currentY += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);

  const analysisText = "Enquanto soluções convencionais (Solar e Eólica) deixam enormes gaps energéticos devido à dependência do clima e necessitam de pesados bancos de baterias (BESS) apenas para sobrevivência noturna ou em calmaria, o Equipamento Cinético-Magnético OCTA garante operação constante Base Load. Ele atua como alimentador principal ou como o carregador perfeito de sistemas BESS para projetos distantes ou remotos da infraestrutura de rede nacional. Sua imunidade às condições climáticas garante que plantas produtivas críticas, indústrias, mineradoras e agronegócios mantenham seu ritmo produtivo estável sem o receio de apagões comerciais ou a necessidade de geradores fósseis barulhentos.";
  const splitAnalysis = doc.splitTextToSize(analysisText, pageWidth - margin * 2);
  doc.text(splitAnalysis, margin, currentY);

  addPageFooter(3, 6);

  // ==========================================
  // PAGE 4: PORTFOLIO - LOW-MEDIUM RANGE (15kW a 100kW)
  // ==========================================
  doc.addPage();
  currentY = 36;
  addPageHeader("Modelos: Comercial e Agrícola");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Gama Residencial, Comercial & Agrícola de Baixa Carga", margin, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Segurança de abastecimento base load para residências de alto padrão, clínicas, pequenos comércios e agronegócio.", margin, currentY + 4);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);
  currentY += 10;

  const page4Gens = generatorsData.filter(g => g.powerKw <= 100);

  page4Gens.forEach((g) => {
    doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
    doc.rect(margin, currentY, pageWidth - margin * 2, 34, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, pageWidth - margin * 2, 34, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
    doc.text(g.name, margin + 5, currentY + 6);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(colorCyan[0], colorCyan[1], colorCyan[2]);
    doc.text(`Segmento: ${g.category}`, margin + 5, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    const splitDesc = doc.splitTextToSize(g.description, pageWidth - margin * 2 - 80);
    doc.text(splitDesc, margin + 5, currentY + 15.5);

    // Specs Box (Right side)
    const specsX = margin + 112;
    doc.setFillColor(255, 255, 255);
    doc.rect(specsX, currentY + 3, 62, 28, "F");
    doc.setDrawColor(241, 245, 249);
    doc.rect(specsX, currentY + 3, 62, 28, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.text(`• Potência:`, specsX + 3, currentY + 7.5);
    doc.text(`• Tensão / Fase:`, specsX + 3, currentY + 11.5);
    doc.text(`• Rendimento:`, specsX + 3, currentY + 15.5);
    doc.text(`• Área Requerida:`, specsX + 3, currentY + 19.5);
    doc.text(`• Refrigeração:`, specsX + 3, currentY + 23.5);

    doc.setFont("helvetica", "normal");
    doc.text(`${g.powerKw} kW`, specsX + 26, currentY + 7.5);
    doc.text(`${g.phase} | ${g.voltage.split(" ou ")[0]}`, specsX + 26, currentY + 11.5);
    doc.text(`${g.efficiency.split(" (")[0]}`, specsX + 26, currentY + 15.5);
    doc.text(`${g.areaNeeded}`, specsX + 26, currentY + 19.5);
    doc.text(`${g.cooling}`, specsX + 26, currentY + 23.5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
    doc.text(`Diferencial: ${g.features[0]}`, margin + 5, currentY + 30.5);

    currentY += 38;
  });

  addPageFooter(4, 6);

  // ==========================================
  // PAGE 5: PORTFOLIO - CORPORATE & MEDIUM RANGE (150kW a 350kW)
  // ==========================================
  doc.addPage();
  currentY = 36;
  addPageHeader("Modelos: Corporativo e Industrial Leve");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Gama Corporativa & Industrial de Média Carga", margin, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Geração contínua inteligente para redes de supermercados, shoppings, grandes condomínios corporativos e pequenas indústrias.", margin, currentY + 4);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);
  currentY += 10;

  const page5Gens = generatorsData.filter(g => g.powerKw >= 150 && g.powerKw <= 350);

  page5Gens.forEach((g) => {
    doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
    doc.rect(margin, currentY, pageWidth - margin * 2, 34, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, pageWidth - margin * 2, 34, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
    doc.text(g.name, margin + 5, currentY + 6);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(colorCyan[0], colorCyan[1], colorCyan[2]);
    doc.text(`Segmento: ${g.category}`, margin + 5, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    const splitDesc = doc.splitTextToSize(g.description, pageWidth - margin * 2 - 80);
    doc.text(splitDesc, margin + 5, currentY + 15.5);

    // Specs Box (Right side)
    const specsX = margin + 112;
    doc.setFillColor(255, 255, 255);
    doc.rect(specsX, currentY + 3, 62, 28, "F");
    doc.setDrawColor(241, 245, 249);
    doc.rect(specsX, currentY + 3, 62, 28, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.text(`• Potência:`, specsX + 3, currentY + 7.5);
    doc.text(`• Tensão / Fase:`, specsX + 3, currentY + 11.5);
    doc.text(`• Rendimento:`, specsX + 3, currentY + 15.5);
    doc.text(`• Área Requerida:`, specsX + 3, currentY + 19.5);
    doc.text(`• Refrigeração:`, specsX + 3, currentY + 23.5);

    doc.setFont("helvetica", "normal");
    doc.text(`${g.powerKw} kW`, specsX + 26, currentY + 7.5);
    doc.text(`${g.phase} | ${g.voltage.split(" ou ")[0]}`, specsX + 26, currentY + 11.5);
    doc.text(`${g.efficiency.split(" (")[0]}`, specsX + 26, currentY + 15.5);
    doc.text(`${g.areaNeeded}`, specsX + 26, currentY + 19.5);
    doc.text(`${g.cooling}`, specsX + 26, currentY + 23.5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
    doc.text(`Diferencial: ${g.features[0]}`, margin + 5, currentY + 30.5);

    currentY += 38;
  });

  addPageFooter(5, 6);

  // ==========================================
  // PAGE 6: PORTFOLIO - HEAVY INDUSTRIAL RANGE (400kW a 1MW) & ENGENHARIA DE PROJETO
  // ==========================================
  doc.addPage();
  currentY = 36;
  addPageHeader("Modelos: Linha Industrial Pesada");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Gama Industrial & Megawatt Station para Cargas Críticas", margin, currentY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
  doc.text("Retorno financeiro agressivo para mineradoras, grandes indústrias, polos petroquímicos e grandes datacenters de IA.", margin, currentY + 4);

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 5.5, pageWidth - margin, currentY + 5.5);
  currentY += 10;

  const page6Gens = generatorsData.filter(g => g.powerKw >= 400);

  page6Gens.forEach((g) => {
    doc.setFillColor(colorBgLightGray[0], colorBgLightGray[1], colorBgLightGray[2]);
    doc.rect(margin, currentY, pageWidth - margin * 2, 34, "F");
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, pageWidth - margin * 2, 34, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
    doc.text(g.name, margin + 5, currentY + 6);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(7.5);
    doc.setTextColor(colorCyan[0], colorCyan[1], colorCyan[2]);
    doc.text(`Segmento: ${g.category}`, margin + 5, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
    const splitDesc = doc.splitTextToSize(g.description, pageWidth - margin * 2 - 80);
    doc.text(splitDesc, margin + 5, currentY + 15.5);

    // Specs Box (Right side)
    const specsX = margin + 112;
    doc.setFillColor(255, 255, 255);
    doc.rect(specsX, currentY + 3, 62, 28, "F");
    doc.setDrawColor(241, 245, 249);
    doc.rect(specsX, currentY + 3, 62, 28, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.8);
    doc.text(`• Potência:`, specsX + 3, currentY + 7.5);
    doc.text(`• Tensão / Fase:`, specsX + 3, currentY + 11.5);
    doc.text(`• Rendimento:`, specsX + 3, currentY + 15.5);
    doc.text(`• Área Requerida:`, specsX + 3, currentY + 19.5);
    doc.text(`• Refrigeração:`, specsX + 3, currentY + 23.5);

    doc.setFont("helvetica", "normal");
    doc.text(`${g.powerKw} kW`, specsX + 26, currentY + 7.5);
    doc.text(`${g.phase} | ${g.voltage.split(" ou ")[0]}`, specsX + 26, currentY + 11.5);
    doc.text(`${g.efficiency.split(" (")[0]}`, specsX + 26, currentY + 15.5);
    doc.text(`${g.areaNeeded}`, specsX + 26, currentY + 19.5);
    doc.text(`${g.cooling}`, specsX + 26, currentY + 23.5);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(6.5);
    doc.setTextColor(colorTextMuted[0], colorTextMuted[1], colorTextMuted[2]);
    doc.text(`Diferencial: ${g.features[0]}`, margin + 5, currentY + 30.5);

    currentY += 38;
  });

  // Back page footer or engineering details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(colorDarkNavy[0], colorDarkNavy[1], colorDarkNavy[2]);
  doc.text("Engenharia de Implantação e Contato", margin, currentY);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY + 1.5, pageWidth - margin, currentY + 1.5);
  currentY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(colorTextDark[0], colorTextDark[1], colorTextDark[2]);
  doc.text("• Sede Operacional Comercial: Avenida Desembargador Moreira, 1300 - BS DESIGN, Sala 711 T-Norte, Aldeota, Fortaleza - CE", margin, currentY + 2.5);
  doc.text("• Contato B2B Oficial: comercial@octaenergia.com.br  |  Portal de Governança: www.vallecggroup.com.br", margin, currentY + 6);

  addPageFooter(6, 6);

  // Save the PDF
  doc.save(`OCTA_ENERGIA_Catalogo_Sistemas_GAEL.pdf`);
}
