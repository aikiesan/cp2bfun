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

    // Track what has already been applied, so a migration runs exactly once
    // and a re-run is cheap. Without this every file re-executed on every
    // boot, which is why the seeds had to be hand-guarded.
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename   VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Run migrations in order
    const migrationsDir = path.join(__dirname, 'migrations');

    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensures migrations run in order (001, 002, 003, etc.)

      const applied = new Set(
        (await client.query('SELECT filename FROM schema_migrations')).rows.map(r => r.filename)
      );

      let pending = migrationFiles.filter(file => !applied.has(file));
      console.log(`📦 Found ${migrationFiles.length} migration(s), ${pending.length} pending`);

      // Filename order is not dependency order: 013 fixes the `microscopio`
      // schema but 018 is what renames `events` into it, so on a fresh
      // database 013 cannot apply on the first pass. Sweep repeatedly and
      // stop as soon as a pass makes no progress — deferred files then get
      // their turn once the table they need exists.
      let deferred = [];

      while (pending.length > 0) {
        deferred = [];

        for (const file of pending) {
          console.log(`🔄 Running migration: ${file}`);
          const migrationPath = path.join(migrationsDir, file);
          const migrationSql = fs.readFileSync(migrationPath, 'utf8');

          // One transaction per file. A multi-statement file is atomic either
          // way in Postgres — the explicit BEGIN just lets us roll back
          // without poisoning the rest of the loop.
          try {
            await client.query('BEGIN');
            await client.query(migrationSql);
            await client.query(
              'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING',
              [file]
            );
            await client.query('COMMIT');
            console.log(`✅ Migration ${file} completed`);
          } catch (error) {
            await client.query('ROLLBACK');

            // Tolerated for a migration whose target has not been created or
            // renamed yet, or already exists:
            //   42P07 - duplicate_table (table already exists)
            //   42710 - duplicate_object (index/constraint already exists)
            //   42P01 - undefined_table (target not renamed yet)
            //   42703 - undefined_column (target column not added yet)
            //
            // The file is deliberately NOT recorded as applied. Postgres
            // rolls back the whole file, so tolerating the error discards
            // every statement in it, including the ones that would have
            // succeeded — that is how news.image_position went missing.
            // Leaving it unrecorded lets a later pass retry it.
            if (['42P07', '42710', '42P01', '42703'].includes(error.code)) {
              deferred.push(file);
              console.log(`⏭️  Migration ${file} deferred (${error.code}): ${error.message}`);
            } else {
              throw error;
            }
          }
        }

        // No progress this pass: the rest cannot be satisfied by retrying.
        if (deferred.length === pending.length) break;
        pending = deferred;
      }

      if (deferred.length > 0) {
        console.warn(
          `⚠️  ${deferred.length} migration(s) never applied and were rolled back entirely: ` +
          `${deferred.join(', ')}.\n` +
          '    Every statement in those files was discarded. If they should have applied, ' +
          'make them idempotent or add a follow-up migration.'
        );
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

export { initializeDatabase };
export default initializeDatabase;
