import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Initialize database schema and run migrations
 */
async function initializeDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔄 Initializing database...');

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('📋 Creating tables from schema.sql...');
    await client.query(schemaSql);
    console.log('✅ Schema created successfully');

    // Run migrations in order
    const migrationsDir = path.join(__dirname, 'migrations');

    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensures migrations run in order (001, 002, 003, etc.)

      console.log(`📦 Found ${migrationFiles.length} migration(s)`);

      for (const file of migrationFiles) {
        console.log(`🔄 Running migration: ${file}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSql = fs.readFileSync(migrationPath, 'utf8');

        try {
          await client.query(migrationSql);
          console.log(`✅ Migration ${file} completed`);
        } catch (error) {
          // If error is about already existing objects, it's okay (already migrated)
          if (error.code === '42P07' || error.code === '42710') {
            console.log(`⚠️  Migration ${file} already applied (skipping)`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log('🎉 Database initialization complete!');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('✨ All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

export default initializeDatabase;
