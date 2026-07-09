import 'dotenv/config';
import postgres from 'postgres';

async function findPublicConstraints() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error('DATABASE_URL_DIRECT is not set');
    process.exit(1);
  }
  const sql = postgres(url);
  try {
    const res = await sql`
      SELECT 
        c.conname, 
        pg_get_constraintdef(c.oid) as consrc, 
        t.relname as table_name 
      FROM pg_constraint c 
      JOIN pg_class t ON t.oid = c.conrelid 
      JOIN pg_namespace n ON n.oid = t.relnamespace 
      WHERE c.contype = 'c' AND n.nspname = 'public'
    `;
    console.log('Public Table Constraints:');
    console.log(JSON.stringify(res, null, 2));

  } catch (err) {
    console.error('Query failed:', err);
  } finally {
    await sql.end();
  }
}

findPublicConstraints();
