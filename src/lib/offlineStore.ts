import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { AnswerResult, BanksPayload, CampaignState } from './types'

export interface StoredResult extends AnswerResult {
  /** 0 = not yet uploaded, 1 = uploaded */
  synced: 0 | 1
}

interface GeoDB extends DBSchema {
  kv: { key: string; value: unknown }
  results: {
    key: number
    value: StoredResult
    indexes: { 'by-synced': number }
  }
}

let dbPromise: Promise<IDBPDatabase<GeoDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<GeoDB>('geo-quiz', 1, {
      upgrade(db) {
        db.createObjectStore('kv')
        const results = db.createObjectStore('results', { keyPath: 'key', autoIncrement: true })
        results.createIndex('by-synced', 'synced')
      }
    })
  }
  return dbPromise
}

// ---- banks / meta (key-value) ----

export async function saveBanks(banks: BanksPayload): Promise<void> {
  const db = await getDB()
  await db.put('kv', banks, 'banks')
  await db.put('kv', new Date().toISOString(), 'lastSync')
}

export async function loadBanks(): Promise<BanksPayload | null> {
  const db = await getDB()
  return ((await db.get('kv', 'banks')) as BanksPayload | undefined) ?? null
}

export async function getLastSync(): Promise<string | null> {
  const db = await getDB()
  return ((await db.get('kv', 'lastSync')) as string | undefined) ?? null
}

// ---- RPG campaign save & roster (key-value) ----

export async function saveCampaign(c: CampaignState): Promise<void> {
  const db = await getDB()
  await db.put('kv', c, 'campaign')
}

export async function loadCampaign(): Promise<CampaignState | null> {
  const db = await getDB()
  return ((await db.get('kv', 'campaign')) as CampaignState | undefined) ?? null
}

export async function clearCampaign(): Promise<void> {
  const db = await getDB()
  await db.delete('kv', 'campaign')
}

export async function saveRoster(names: string[]): Promise<void> {
  const db = await getDB()
  await db.put('kv', names, 'roster')
}

export async function loadRoster(): Promise<string[] | null> {
  const db = await getDB()
  return ((await db.get('kv', 'roster')) as string[] | undefined) ?? null
}

// ---- results ----

export async function addResults(rows: AnswerResult[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('results', 'readwrite')
  for (const r of rows) await tx.store.add({ ...r, synced: 0 })
  await tx.done
}

export async function getUnsynced(): Promise<Array<StoredResult & { key: number }>> {
  const db = await getDB()
  const all = await db.getAllFromIndex('results', 'by-synced', 0)
  return all as Array<StoredResult & { key: number }>
}

export async function markSynced(keys: number[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('results', 'readwrite')
  for (const key of keys) {
    const row = await tx.store.get(key)
    if (row) await tx.store.put({ ...row, synced: 1 })
  }
  await tx.done
}

export async function pendingCount(): Promise<number> {
  const db = await getDB()
  return db.countFromIndex('results', 'by-synced', 0)
}

export async function getAllResults(): Promise<StoredResult[]> {
  const db = await getDB()
  return db.getAll('results')
}
