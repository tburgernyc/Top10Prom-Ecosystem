import 'dotenv/config';
import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

async function applySchema() {
  const url = process.env.DATABASE_URL_DIRECT;
  if (!url) {
    console.error('DATABASE_URL_DIRECT is not set');
    process.exit(1);
  }

  const sql = postgres(url);
  const sqlFilePath = path.join(process.cwd(), 'drizzle', '0000_certain_mephistopheles.sql');
  
  if (!fs.existsSync(sqlFilePath)) {
    console.error('Migration file not found at:', sqlFilePath);
    process.exit(1);
  }

  const content = fs.readFileSync(sqlFilePath, 'utf-8');
  const statements = content.split('--> statement-breakpoint');

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const rawStmt = statements[i].trim();
    if (!rawStmt) continue;

    // Remove comments
    const stmt = rawStmt.replace(/--.*$/gm, '').trim();
    if (!stmt) continue;

    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    try {
      await sql.unsafe(stmt);
      console.log(`[✓] Success`);
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        console.warn(`[!] Skipped (object already exists)`);
      } else {
        console.error(`[X] Failed:`, err.message);
        // We continue anyway to try other parts, but we might want to fail-fast
      }
    }
  }

  console.log('Schema application complete.');
  await sql.end();
}

applySchema().catch(console.error);
