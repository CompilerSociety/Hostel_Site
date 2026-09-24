import bcrypt from 'bcryptjs';
import { User, Session } from '../models/index.js';
import { createSession, publicUser } from '../services/auth.js';
import { cookieOptions } from '../config/env.js';
import { HttpError } from '../middleware/http.js';

export async function register(req, res) {
  const { password, ...data } = req.validated.body;
  const user = await User.create({ ...data, password: await bcrypt.hash(password, 12) });
  await createSession(user, res);
  res.status(201).json({ data: publicUser(user) });
}
const dummyHash = bcrypt.hashSync('not-a-real-password', 12);
export async function login(req, res) {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select('+password');
  const valid = await bcrypt.compare(password, user?.password || dummyHash);
  if (!valid || !user?.active) throw new HttpError(401, 'Invalid email or password');
  await createSession(user, res);
  res.json({ data: publicUser(user) });
}
export async function logout(req, res) {
  await Session.deleteOne({ _id: req.sessionId });
  req.app.get('io')?.in(`session:${req.sessionId}`).disconnectSockets(true);
  res.clearCookie('session', cookieOptions).status(204).end();
}
export async function profile(req, res) {
  req.user.name = req.validated.body.name;
  await req.user.save();
  res.json({ data: publicUser(req.user) });
}
