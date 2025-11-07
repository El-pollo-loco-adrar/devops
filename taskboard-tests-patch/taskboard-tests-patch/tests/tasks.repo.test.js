/**
 * Tests de base du Repository :
 * - list(): appelle bien db.query (SQL émis).
 * On mocke db.query pour garantir l'isolation et observer l'appel.
 */
import { describe, it, expect, vi } from 'vitest';
import { makeTasksRepo } from '../src/repositories/tasks.repo.js';

it('list() appelle db.query', async () => {
  const db = { query: vi.fn(async () => ({ rows: [], rowCount: 0 })) };
  const repo = makeTasksRepo(db);
  await repo.list();
  expect(db.query).toHaveBeenCalled();
});
