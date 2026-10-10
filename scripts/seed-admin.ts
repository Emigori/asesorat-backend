/**
 * Crea (o actualiza) un usuario administrador.
 * Uso: ADMIN_EMAIL=admin@asesorat.mx ADMIN_PASSWORD=... npm run seed
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database';
import { User } from '../src/modules/users/user.model';

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD');
  await connectDatabase();
  const hash = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.set({ password: hash, role: 'admin' });
    await existing.save();
  } else {
    await User.create({ name: 'Administrador', email, password: hash, role: 'admin' });
  }
  console.log(`[seed] Administrador listo: ${email}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
