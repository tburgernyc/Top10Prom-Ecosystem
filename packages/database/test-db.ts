import 'dotenv/config';
import postgres from 'postgres';

async function testConnection() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error('DATABASE_URL_DIRECT is not set');
    process.exit(1);
  }
  console.log('Testing connection to:', url.split('@')[1]); // Log host only for safety
  const sql = postgres(url);
  try {
    const result = await sql`SELECT 1`;
    console.log('Connection successful:', result);
  } catch (err) {
    console.error('Connection failed:', err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

testConnection();
