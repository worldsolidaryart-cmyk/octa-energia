export interface GeneratorModel {
  id: string;
  powerKw: number;
  name: string;
  category: string;
  voltage: string;
  frequency: string;
  areaNeeded: string;
  image: string;
  features: string[];
  efficiency: string;
  description: string;
  cooling: string;
  startingSystem: string;
  warranty: string;
  phase: string;
  waveType: string;
}

export interface FinancialMetrics {
  powerKw: number;
  monthlyGenerationKwh: number;
  tariffReais: number;
  monthlySavingsReais: number;
  annualSavingsReais: number;
  estimatedPaybackMonthsMin: number;
  estimatedPaybackMonthsMax: number;
  irrPercentage: number;
  vplMillionsMin: number;
  vplMillionsMax: number;
}
