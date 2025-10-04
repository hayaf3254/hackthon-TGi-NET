// src/db.ts
import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Neon(プーラー)に合わせてSSLを必ずON
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true }, // 証明書検証を有効（問題あれば一時的に false で様子見）
  // 接続数は最小限でOK。必要なら max: 5 など
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
