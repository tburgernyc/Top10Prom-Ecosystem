import 'dotenv/config';
import postgres from 'postgres';

async function diagnoseDrizzleCrash() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error('DATABASE_URL_DIRECT is not set');
    process.exit(1);
  }
  const sql = postgres(url);
  try {
    console.log('--- ALL RLS Policies ---');
    const policies = await sql`
      SELECT schemaname, tablename, policyname, with_check 
      FROM pg_policies
    `;
    console.log(JSON.stringify(policies, null, 2));

    console.log('\n--- ALL Check Constraints ---');
    const constraints = await sql`
      SELECT 
        conname, 
        contype, 
        confrelid::regclass as table_name,
        pg_get_constraintdef(oid) as consrc
      FROM pg_constraint 
      WHERE contype = 'c'
    `;
    console.log(JSON.stringify(constraints, null, 2));

  } catch (err) {
    console.error('Diagnostic query failed:', err);
  } finally {
    await sql.end();
  }
}

diagnoseDrizzleCrash();
