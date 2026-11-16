/**
 * PhoneVerse 2026 - Non-Destructive Database Migrator
 * Applies PostgreSQL schema migrations safely without overwriting or dropping existing data.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;

  console.log('===========================================================');
  console.log('PhoneVerse 2026: Non-Destructive Database Migration Runner');
  console.log('===========================================================');

  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL environment variable is not set.');
    console.warn('ℹ️  Set DATABASE_URL in your .env or environment to run migrations against your database.');
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL.');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🔄 Executing non-destructive schema definitions (CREATE TABLE IF NOT EXISTS)...');
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');

    console.log('✅ Migration applied successfully without touching existing data.');

    // Verify verified tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('\n📊 Verified active tables in database:');
    res.rows.forEach(r => console.log(`   ✔️  ${r.table_name}`));

    client.release();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

runMigration();
