/**
 * Ces tests ciblent la couche Service (métier) pour les cas limites :
 * - create() : trim du title + status par défaut 'todo' si non fourni.
 * - get() : accepte une string numérique '1' et refuse 0, négatifs.
 * - updateStatus() : refuse id non valide (0, négatif).
 * - Propagation d'une erreur remontée par le repo (ex: panne DB).
 * Les accès repo sont mockés : aucun appel réel à la base.
 */
import { describe, it, expect } from 'vitest';
import { makeTasksService } from '../src/services/tasks.service.js';

const baseRepo = {
  list: async () => ({ rows: [] }),
  getById: async (id) => ({ rows: id===1 ? [{ id:1, title:'A', status:'todo'}] : [] }),
  create: async ({ title, status }) => ({ rows: [{ id: 1, title, status }], rowCount: 1 }),
  updateStatus: async (id, status) => ({ rows: [{ id, title: 'A', status }], rowCount: 1 }),
  remove: async (id) => ({ rowCount: id === 1 ? 1 : 0 }),
};

describe('tasks.service (extras)', () => {
  it('create() trim title + default status', async () => {
    const s = makeTasksService(baseRepo);
    const t = await s.create({ title: '  Hello  ' });
    expect(t).toMatchObject({ title: 'Hello', status: 'todo' });
  });

  it('get() accepte "1" et refuse bornes 0/négatif', async () => {
    const s = makeTasksService(baseRepo);
    expect(await s.get("1")).toMatchObject({ id:1 });
    expect(await s.get(0)).toBeNull();
    expect(await s.get(-1)).toBeNull();
  });

  it('updateStatus() refuse bornes id', async () => {
    const s = makeTasksService(baseRepo);
    expect(await s.updateStatus(0, 'doing')).toBeNull();
    expect(await s.updateStatus(-5, 'doing')).toBeNull();
  });

  it('propagation erreur repo', async () => {
    const failing = {
      ...baseRepo,
      create: async () => { const e = new Error('db down'); e.code='ECONN'; throw e; }
    };
    const s = makeTasksService(failing);
    await expect(s.create({ title:'x', status:'todo'})).rejects.toMatchObject({ code:'ECONN' });
  });
});
