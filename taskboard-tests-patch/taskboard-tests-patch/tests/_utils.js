/**
 * Utilitaires de tests pour simuler les objets Express.
 * - mockReq: crée un objet req minimal (params/body/query) avec overrides facultatifs.
 * - mockRes: crée un objet res minimal avec status/json/send mémorisant le statusCode et la payload.
 * - mockNext: fabrique une fonction next(err) qui alimente la réponse d'erreur JSON (comme un middleware d'erreur).
 */
export function mockReq(overrides = {}) {
  return { params: {}, body: {}, query: {}, ...overrides };
}
export function mockRes() {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => { res.statusCode = code; return res; };
  res.jsonData = undefined;
  res.json = (data) => { res.jsonData = data; return res; };
  res.send = () => res;
  return res;
}
export function mockNext(res) {
  return (err) => res.status(err.status || 500).json({ error: err.message });
}
