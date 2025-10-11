import Dexie from 'dexie'

export const db = new Dexie('baseData')

db.version(1).stores({
  lordEquipment: '++id, level, cost5', // Primary key and indexed props
  gems: '++id, level, cost4', // Primary key and indexed props
  heroEquipment: '++id, level, cost3',
  mastery: '++id, level, cost2',
  character: '++id,name,commanderLevel',
})
