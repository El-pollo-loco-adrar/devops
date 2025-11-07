/**
 * Ces tests ciblent la couche Controller :
 * - Cas d'erreur 400 : le service jette une erreur avec .status=400 et le contrôleur renvoie bien 400 + { error }.
 * On passe un next mocké via mockNext(res) pour simuler le middleware d'erreur Express.
 */
import { describe, it, expect } from 'vitest';
import { makeTasksController } from '../src/controllers/tasks.controller.js';
import { mockReq, mockRes, mockNext } from './_utils.js';

describe('tasks.controller (400)', () => {
  it('create → 400 si service jette 400', async () => {
    const svc = {
      create: async () => { const e = new Error('Invalid'); e.status = 400; throw e; }
    };
    const c = makeTasksController(svc);
    const req = mockReq({ body: { title:'', status:'oops' } });
    const res = mockRes();

    await c.create(req, res, mockNext(res));

    expect(res.statusCode).toBe(400);
    expect(res.jsonData).toMatchObject({ error: 'Invalid' });
  });
});
