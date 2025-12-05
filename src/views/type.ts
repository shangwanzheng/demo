export interface Character {
  id: number
  name: string
  commanderLevel: number
  shieldLife: number
  arrowPenetration: number
  spearPenetration: number
  ticketCount: number
  askingPrice: number
  t11Progress: number
  fireCrystalProgress: number
  targetCostPerformance: number
  lordEquipment: LordEquipment[]
  heroEquipment: HeroEquipment[]
  costs?: Costs
}

interface LordEquipment {
  level: string
  gem1: number
  gem2: number
  gem3: number
}

interface HeroEquipment {
  level: string
  mastery: number
}

interface Costs {
  lordEquipment: number
  gem: number
  heroEquipment: number
  ticket: number
  total: number
  overall: number
  performance: number
  targetPrice: number
  periceReduction: number
}
