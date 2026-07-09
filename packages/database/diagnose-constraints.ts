import 'dotenv/config';
import postgres from 'postgres';

async function diagnoseCheckConstraints() {
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
        pg_get_constraintdef(oid) as consrc
      FROM pg_constraint 
      WHERE contype = 'c'
    `;
    console.log('Check Constraints Found:');
    res.forEach(c => {
      console.log(`- Table: ${c.table_name}, Name: ${c.conname}, Src: ${c.consrc}`);
      if (!c.consrc) {
        console.warn(`  ⚠️ WARNING: Constraint ${c.conname} on ${c.table_name} has no source string!`);
      }
    });

    if (res.length === 0) {
      console.log('No check constraints found.');
    }

  } catch (err) {
    console.error('Inspection failed:', err);
  } finally {
    await sql.end();
  }
}

diagnoseCheckConstraints();
