import Dexie, { type EntityTable } from 'dexie'
import type { Character } from './views/type'

export const db = new Dexie('baseData') as Dexie & {
  character: EntityTable<
    Character,
    'id' // primary key "id" (for the typings only)
  >
}

db.version(1).stores({
  lordEquipment: '++id, level, cost5', // Primary key and indexed props
  gems: '++id, level, cost4', // Primary key and indexed props
  heroEquipment: '++id, level, cost3',
  mastery: '++id, level, cost2',
  character: '++id,name,commanderLevel',
})

// export const character = db.table('character')
