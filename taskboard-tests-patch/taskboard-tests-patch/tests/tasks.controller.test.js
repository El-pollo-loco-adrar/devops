/**
 * Tests de base du Controller :
 * - list: renvoie 200 + JSON d'une liste d'items via le service mocké.
 * On ne démarre pas de serveur HTTP : appels directs des handlers Express.
 */
import { describe, it, expect } from 'vitest';
import { makeTasksController } from '../src/controllers/tasks.controller.js';
import { mockReq, mockRes } from './_utils.js';

function svc() {
  return {
    list: async () => [{ id:1, title:'A', status:'todo'}],
    get: async (id) => id===1 ? { id:1, title:'A', status:'todo'} : null,
    create: async (d) => ({ id:2, ...d }),
    updateStatus: async (id, status) => id===1 ? ({ id, title:'A', status }) : null,
    remove: async (id) => id===1,
  };
}

describe('tasks.controller (base)', () => {
  it('list → 200 + json', async () => {
    const c = makeTasksController(svc());
    const res = mockRes();
    await c.list(mockReq(), res);
    expect(res.jsonData.length).toBe(1);
  });
});
