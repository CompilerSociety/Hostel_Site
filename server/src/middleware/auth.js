import { verifySession } from '../services/auth.js';
import { HttpError } from './http.js';
export async function authenticate(req, res, next) {
  Object.assign(req, await verifySession(req.cookies.session));
  next();
}
export const roles = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user.role)) throw new HttpError(403, 'Access denied');
  next();
};
