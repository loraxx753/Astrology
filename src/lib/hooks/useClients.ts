export async function editClient(id: number, updates: Partial<Client>): Promise<void> {
  const db = await getDB();
  const client = await db.get('clients', id);
  if (!client) throw new Error('Client not found');
  await db.put('clients', { ...client, ...updates });
}

export async function deleteClient(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('clients', id);
}
import { useEffect, useState, useCallback } from 'react';
import { openDB } from 'idb';

async function getDB() {
  return openDB('AstrologyDB', 1, {
    upgrade(db) {
      db.createObjectStore('clients', { keyPath: 'id', autoIncrement: true });
    },
  });
}

export interface Client {
  id?: number;
  name: string;
  // Add other client fields as needed
}

export async function saveClient(client: Omit<Client, 'id'>): Promise<void> {
  const db = await getDB();
  await db.add('clients', client);
}

export async function getAllClients(): Promise<Client[]> {
  const db = await getDB();
  return db.getAll('clients');
}

// React hook for clients
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllClients();
      setClients(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const save = useCallback(async (client: Omit<Client, 'id'>) => {
    await saveClient(client);
    await loadClients();
  }, [loadClients]);

  const edit = useCallback(async (id: number, updates: Partial<Client>) => {
    await editClient(id, updates);
    await loadClients();
  }, [loadClients]);

  const remove = useCallback(async (id: number) => {
    await deleteClient(id);
    await loadClients();
  }, [loadClients]);

  return {
    clients,
    loading,
    error,
    saveClient: save,
    editClient: edit,
    deleteClient: remove,
    reload: loadClients,
  };
}