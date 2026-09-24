import { z } from 'zod';
import { origins } from '../config/env.js';

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) return res.status(400).json({ error: { message: 'Validation failed', details: parsed.error.flatten() } });
    req.validated = { ...req.validated, [source]: parsed.data };
    next();
  };
}
export const id = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ID');
export const pagination = z.object({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
}).strict();
export function originGuard(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (!origins.includes(req.get('origin')) || req.get('x-requested-with') !== 'HostelHub') {
    return next(new HttpError(403, 'Trusted Origin and X-Requested-With: HostelHub are required'));
  }
  next();
}
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let status = err.status || 500;
  if (err.code === 11000 || err.name === 'VersionError') status = 409;
  if (['ValidationError', 'CastError', 'MulterError'].includes(err.name)) status = 400;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: { message: status >= 500 ? 'Internal server error' : status === 409 ? 'Record already exists or changed; reload and retry' : err.message } });
}
