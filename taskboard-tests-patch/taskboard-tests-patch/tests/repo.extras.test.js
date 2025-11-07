/**
 * Ces tests ciblent la couche Repository (accès DB) en mode isolé :
 * - Propagation d'une erreur DB (db.query qui lève) vers l'appelant.
 * - Vérification des paramètres passés à updateStatus (ordre [id, status]).
 * On mocke db.query pour capturer et contrôler le comportement.
 */
import { describe, it, expect, vi } from 'vitest';
import { makeTasksRepo } from '../src/repositories/tasks.repo.js';

it('repo propage les erreurs DB', async () => {
  const db = { query: vi.fn(async () => { throw new Error('db fail'); }) };
  const repo = makeTasksRepo(db);
  await expect(repo.list()).rejects.toThrow('db fail');
});

it('updateStatus passe bien [id, status]', async () => {
  const calls = [];
  const db = { query: vi.fn(async (_sql, params) => { calls.push(params); return { rows:[{ id: 9, title:'A', status:'done' }], rowCount:1 }; }) };
  const repo = makeTasksRepo(db);
  const { rows } = await repo.updateStatus(9, 'done');
  expect(calls[0]).toEqual([9, 'done']);
  expect(rows[0]).toMatchObject({ id:9, status:'done' });
});
