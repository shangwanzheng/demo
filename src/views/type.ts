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
