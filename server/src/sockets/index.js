import { Server } from 'socket.io';
import { parse } from 'cookie';
import { origins } from '../config/env.js';
import { verifySession } from '../services/auth.js';

// Writes use the REST API, which provides validation and rate limiting.
// Private user rooms deliver notifications and read receipts to every logged-in tab.
export function attachSockets(server) {
  const io = new Server(server, {
    cors: { origin: origins, credentials: true },
    allowRequest: (req, callback) => callback(null, origins.includes(req.headers.origin)),
    maxHttpBufferSize: 16384,
  });
  io.use(async (socket, next) => {
    try {
      const token = parse(socket.request.headers.cookie || '').session;
      socket.data = { ...await verifySession(token), token };
      next();
    } catch { next(new Error('Please sign in')); }
  });
  io.on('connection', socket => {
    socket.join(`user:${socket.data.user.id}`);
    socket.join(`session:${socket.data.sessionId}`);
    const timer = setInterval(async () => {
      try { await verifySession(socket.data.token); } catch { socket.disconnect(true); }
    }, 15000);
    timer.unref();
    socket.on('disconnect', () => clearInterval(timer));
  });
  return io;
}
