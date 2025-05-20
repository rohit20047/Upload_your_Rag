import { getClient } from '../utils/db.js';

export const getChatsByUserId = async (email) => {
  const client = getClient();
  try {
    await client.connect();

    const result = await client.query(
      'SELECT * FROM chats WHERE email = $1 ORDER BY created_at DESC',
      [email]
    );

    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    await client.end();
  }
};
