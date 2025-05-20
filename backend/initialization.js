import { getClient } from './src/utils/db.js';

const createTableQuery = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    Email TEXT NOT NULL,
    chat_id TEXT NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

(async () => {
  const client = getClient();

  try {
    await client.connect();
    await client.query(createTableQuery);
    console.log('✅ chats table created (if not exists)');
  } catch (error) {
    console.error('❌ Failed to create table:', error);
  } finally {
    await client.end();
  }
})();
