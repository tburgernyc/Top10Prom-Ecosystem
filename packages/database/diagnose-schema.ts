import 'dotenv/config';
import postgres from 'postgres';

async function inspectConstraints() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error('DATABASE_URL_DIRECT is not set');
    process.exit(1);
  }
  const sql = postgres(url);
  try {
    const res = await sql`
      SELECT 
        conname, 
        contype, 
        confrelid::regclass as table_name,
        consysid as source_id
      FROM pg_constraint 
      WHERE contype = 'c'
    `;
    console.log('Check Constraints:');
    console.log(JSON.stringify(res, null, 2));

    const policies = await sql`
      SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
      FROM pg_policies
    `;
    console.log('\nRLS Policies:');
    console.log(JSON.stringify(policies, null, 2));

  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await sql.end();
  }
}

inspectConstraints();
