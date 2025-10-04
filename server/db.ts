// db.ts
import 'dotenv/config';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// DATABASE_URLから options パラメータを除去
let connectionString = process.env.DATABASE_URL;

// options パラメータが含まれている場合は除去
if (connectionString.includes('options=')) {
  const url = new URL(connectionString);
  url.searchParams.delete('options');
  connectionString = url.toString();
}

// Neon(プーラー)に合わせてSSLを必ずON
export const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }, // 一旦 false に変更
});

export const query = (text: string, params?: any[]) => pool.query(text, params);