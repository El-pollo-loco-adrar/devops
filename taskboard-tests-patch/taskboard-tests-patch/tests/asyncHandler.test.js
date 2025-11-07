/**
 * Ce test vérifie le petit utilitaire asyncHandler :
 * - qu'une erreur asynchrone levée dans un handler est bien transmise à next(err).
 */
import { it, expect, vi } from 'vitest';
import { asyncHandler } from '../src/lib/asyncHandler.js';

it('asyncHandler transmet les erreurs à next(err)', async () => {
  const err = new Error('boom');
  const h = asyncHandler(async () => { throw err; });
  const next = vi.fn();
  await h({}, {}, next);
  expect(next).toHaveBeenCalledWith(err);
});
