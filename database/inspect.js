/**
 * PhoneVerse 2026 - Database Inspector
 * Inspects existing PostgreSQL database tables, columns, indexes, and constraints.
 */

const { Pool } = require('pg');

async function inspectDatabase() {
  const connectionString = process.env.DATABASE_URL;

  console.log('===========================================================');
  console.log('PhoneVerse 2026: PostgreSQL Database Schema Inspector');
  console.log('===========================================================');

  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL environment variable is not set.');
    console.warn('ℹ️  To inspect your remote/existing database, run:');
    console.warn('    DATABASE_URL="postgres://user:pass@host:5432/dbname" npm run db:inspect');
    console.log('-----------------------------------------------------------');
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected successfully to PostgreSQL database.');

    // Query all existing tables in public schema
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (tablesRes.rows.length === 0) {
      console.log('ℹ️  No existing tables found in public schema. Ready for initial migration.');
    } else {
      console.log(`\n📋 Found ${tablesRes.rows.length} existing tables:`);
      for (const row of tablesRes.rows) {
        const tableName = row.table_name;
        const colRes = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position;
        `, [tableName]);

        console.log(`\n🔹 Table: [${tableName}] (${colRes.rows.length} columns)`);
        colRes.rows.forEach(c => {
          console.log(`   - ${c.column_name.padEnd(25)} : ${c.data_type} (nullable: ${c.is_nullable})`);
        });
      }
    }

    client.release();
  } catch (err) {
    console.error('❌ Database connection or inspection failed:', err.message);
  } finally {
    await pool.end();
  }
}

inspectDatabase();
