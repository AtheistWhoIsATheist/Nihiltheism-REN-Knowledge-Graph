// src/services/storage/IndexedDBStorage.ts
import { GraphStorageSchema } from '../../types/graph';

const DB_NAME = 'nihiltheism_graph_db';
const DB_VERSION = 1;
const STORE_NAME = 'graph_state';
const RECORD_KEY = 'nihiltheism_graph_storage_v1';

let cachedDb: IDBDatabase | null = null;
let pendingSaveTimeout: ReturnType<typeof setTimeout> | null = null;
let pendingSavePromise: Promise<boolean> | null = null;
let pendingSaveResolve: ((val: boolean) => void) | null = null;
let latestPendingSchema: GraphStorageSchema | null = null;

/**
 * Open or retrieve the cached native IndexedDB instance with automatic upgrade handling.
 */
function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  if (cachedDb && cachedDb.objectStoreNames.contains(STORE_NAME)) {
    return Promise.resolve(cachedDb);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        cachedDb = db;
        db.onversionchange = () => {
          db.close();
          cachedDb = null;
        };
        db.onclose = () => {
          cachedDb = null;
        };
        resolve(db);
      };

      request.onerror = (e) => {
        console.warn('[IndexedDBStorage] Failed to open IndexedDB:', e);
        resolve(null);
      };

      request.onblocked = () => {
        console.warn('[IndexedDBStorage] IndexedDB open blocked');
        resolve(null);
      };
    } catch (err) {
      console.warn('[IndexedDBStorage] IndexedDB not available:', err);
      resolve(null);
    }
  });
}

/**
 * Internal executor to commit a schema directly to IndexedDB.
 */
async function executePersist(schema: GraphStorageSchema): Promise<boolean> {
  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      // Deep clone cleanly without transient simulation references
      const cleanSchema: GraphStorageSchema = {
        version: schema.version,
        lastUpdated: schema.lastUpdated,
        documents: schema.documents || [],
        dynamicNodes: (schema.dynamicNodes || []).map(n => ({
          id: n.id,
          label: n.label,
          level: n.level,
          count: n.count,
          type: n.type,
          isLeaf: n.isLeaf,
          parentId: n.parentId,
          stratum: n.stratum,
          stance: n.stance,
          nothingnessSense: n.nothingnessSense,
          roaeProvenance: n.roaeProvenance,
          provenance: n.provenance,
          x: typeof n.x === 'number' ? n.x : undefined,
          y: typeof n.y === 'number' ? n.y : undefined,
          radius: n.radius,
          color: n.color
        })),
        dynamicEdges: (schema.dynamicEdges || []).map(e => ({
          id: e.id,
          source: typeof e.source === 'object' && e.source !== null ? (e.source as { id: string }).id : String(e.source),
          target: typeof e.target === 'object' && e.target !== null ? (e.target as { id: string }).id : String(e.target),
          type: e.type,
          dialecticalRelation: e.dialecticalRelation,
          label: e.label,
          strength: e.strength,
          warrant: e.warrant
        })),
        candidateDiffs: schema.candidateDiffs || [],
        residueItems: schema.residueItems || [],
        contradictions: schema.contradictions || [],
        negativeKnowledge: schema.negativeKnowledge || [],
        voidExperiments: schema.voidExperiments || []
      };

      const putRequest = store.put(cleanSchema, RECORD_KEY);

      putRequest.onsuccess = () => {
        resolve(true);
      };

      putRequest.onerror = (e) => {
        console.warn('[IndexedDBStorage] Error storing schema in IndexedDB:', e);
        resolve(false);
      };

      transaction.onerror = (e) => {
        console.warn('[IndexedDBStorage] Transaction error during put:', e);
        resolve(false);
      };
    } catch (err) {
      console.warn('[IndexedDBStorage] Transaction error in persistGraphSchemaToIDB:', err);
      resolve(false);
    }
  });
}

/**
 * Coalesced / debounced non-blocking persistence.
 * Batches rapid mutations (e.g. streaming, multi-step ingestion) within 200ms
 * into a single IndexedDB transaction, eliminating I/O churn.
 */
export function persistGraphSchemaToIDB(schema: GraphStorageSchema, immediate = false): Promise<boolean> {
  latestPendingSchema = schema;

  if (immediate) {
    if (pendingSaveTimeout) {
      clearTimeout(pendingSaveTimeout);
      pendingSaveTimeout = null;
    }
    const target = latestPendingSchema;
    latestPendingSchema = null;
    const oldResolve = pendingSaveResolve;
    pendingSavePromise = null;
    pendingSaveResolve = null;

    return executePersist(target).then(success => {
      if (oldResolve) oldResolve(success);
      return success;
    });
  }

  if (!pendingSavePromise) {
    pendingSavePromise = new Promise((resolve) => {
      pendingSaveResolve = resolve;
    });
  }

  if (pendingSaveTimeout) {
    clearTimeout(pendingSaveTimeout);
  }

  pendingSaveTimeout = setTimeout(async () => {
    pendingSaveTimeout = null;
    const target = latestPendingSchema;
    latestPendingSchema = null;
    const resolve = pendingSaveResolve;
    pendingSavePromise = null;
    pendingSaveResolve = null;

    if (target) {
      const res = await executePersist(target);
      if (resolve) resolve(res);
    } else {
      if (resolve) resolve(true);
    }
  }, 200);

  return pendingSavePromise;
}

/**
 * Retrieve the stored GraphStorageSchema from IndexedDB.
 */
export async function getGraphSchemaFromIDB(): Promise<GraphStorageSchema | null> {
  const db = await openDatabase();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getRequest = store.get(RECORD_KEY);

      getRequest.onsuccess = () => {
        const result = getRequest.result as GraphStorageSchema | undefined;
        resolve(result || null);
      };

      getRequest.onerror = (e) => {
        console.warn('[IndexedDBStorage] Error reading schema from IndexedDB:', e);
        resolve(null);
      };
    } catch (err) {
      console.warn('[IndexedDBStorage] Transaction error in getGraphSchemaFromIDB:', err);
      resolve(null);
    }
  });
}

/**
 * Clear the stored GraphStorageSchema from IndexedDB.
 */
export async function clearGraphSchemaFromIDB(): Promise<boolean> {
  if (pendingSaveTimeout) {
    clearTimeout(pendingSaveTimeout);
    pendingSaveTimeout = null;
  }
  latestPendingSchema = null;

  const db = await openDatabase();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const deleteRequest = store.delete(RECORD_KEY);

      deleteRequest.onsuccess = () => {
        resolve(true);
      };

      deleteRequest.onerror = (e) => {
        console.warn('[IndexedDBStorage] Error clearing schema from IndexedDB:', e);
        resolve(false);
      };
    } catch (err) {
      console.warn('[IndexedDBStorage] Error clearing IndexedDB:', err);
      resolve(false);
    }
  });
}
