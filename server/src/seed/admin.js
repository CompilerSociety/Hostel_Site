import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';
import { connectDatabase } from '../config/database.js';
import { User } from '../models/index.js';

const account = z.object({
  ADMIN_NAME: z.string().trim().min(1).max(100),
  ADMIN_EMAIL: z.email().transform(value => value.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(12).max(72).refine(value => Buffer.byteLength(value) <= 72),
}).parse(process.env);
try {
  await connectDatabase();
  if (await User.exists({ email: account.ADMIN_EMAIL })) throw new Error('Email already exists; no account was changed');
  await User.create({ name: account.ADMIN_NAME, email: account.ADMIN_EMAIL, password: await bcrypt.hash(account.ADMIN_PASSWORD, 12), role: 'ADMIN' });
  console.log('Administrator created. Remove ADMIN_PASSWORD from the environment.');
} finally { await mongoose.disconnect(); }
