/**
 * Tests de base du Service :
 * - list(): remonte bien les données du repo.
 * - get(): renvoie null pour un id invalide.
 * - create(): renvoie 400 si title est vide.
 * Le repo est mocké pour rester unitaire.
 */
import { describe, it, expect } from 'vitest';
import { makeTasksService } from '../src/services/tasks.service.js';

function makeRepo(stubs = {}) {
  return {
    list: async () => ({ rows: [{ id:1, title:'A', status:'todo'}] }),
    getById: async (id) => ({ rows: id===1 ? [{ id:1, title:'A', status:'todo'}] : [] }),
    create: async ({ title, status }) => ({ rows: [{ id: 2, title, status }], rowCount: 1 }),
    updateStatus: async (id, status) => ({ rows: [{ id, title: 'A', status }], rowCount: 1 }),
    remove: async (id) => ({ rowCount: id === 1 ? 1 : 0 }),
    ...stubs
  };
}

describe('tasks.service (base)', () => {
  it('list() retourne des tâches', async () => {
    const svc = makeTasksService(makeRepo());
    const rows = await svc.list();
    expect(rows.length).toBe(1);
    expect(rows[0].status).toBe('todo');
  });

  it('get() invalide -> null', async () => {
    const svc = makeTasksService(makeRepo());
    expect(await svc.get('abc')).toBeNull();
  });

  it('create() sans title -> 400', async () => {
    const svc = makeTasksService(makeRepo());
    await expect(svc.create({ title: ''})).rejects.toMatchObject({ status: 400 });
  });
});
