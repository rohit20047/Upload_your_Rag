import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export function getClient() {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // required for Neon
    },
  });
}
