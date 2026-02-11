import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log('🔄 Running migration...');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS featured_videos (
        id SERIAL PRIMARY KEY,
        youtube_url VARCHAR(500) NOT NULL,
        youtube_id VARCHAR(50) NOT NULL,
        title_pt TEXT NOT NULL,
        title_en TEXT,
        description_pt TEXT,
        description_en TEXT,
        thumbnail_url VARCHAR(500),
        date_display VARCHAR(50),
        position VARCHAR(1) CHECK (position IN ('A', 'B', 'C')),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_featured_videos_position
      ON featured_videos(position) WHERE active = TRUE;
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_featured_videos_active
      ON featured_videos(active);
    `);
    console.log('✅ Indexes created');

    // Check if test data already exists
    const checkResult = await client.query('SELECT COUNT(*) FROM featured_videos');
    const count = parseInt(checkResult.rows[0].count);

    if (count === 0) {
      console.log('📝 Inserting test videos...');

      // Insert test videos
      await client.query(`
        INSERT INTO featured_videos
        (youtube_url, youtube_id, title_pt, title_en, description_pt, description_en, thumbnail_url, date_display, position, active)
        VALUES
        (
          'https://www.youtube.com/watch?v=ga1g2xZ_FEY',
          'ga1g2xZ_FEY',
          'Música Instrumental Relaxante 1',
          'Relaxing Instrumental Music 1',
          'Uma bela melodia instrumental para relaxar',
          'A beautiful instrumental melody to relax',
          'https://img.youtube.com/vi/ga1g2xZ_FEY/maxresdefault.jpg',
          'Fevereiro 2025',
          'A',
          true
        ),
        (
          'https://www.youtube.com/watch?v=cKxRFlXYquo',
          'cKxRFlXYquo',
          'Música Instrumental Relaxante 2',
          'Relaxing Instrumental Music 2',
          'Segunda melodia instrumental relaxante',
          'Second relaxing instrumental melody',
          'https://img.youtube.com/vi/cKxRFlXYquo/maxresdefault.jpg',
          'Fevereiro 2025',
          'B',
          true
        ),
        (
          'https://www.youtube.com/watch?v=HSOtku1j600',
          'HSOtku1j600',
          'Música Instrumental Relaxante 3',
          'Relaxing Instrumental Music 3',
          'Terceira melodia instrumental para relaxar',
          'Third instrumental melody to relax',
          'https://img.youtube.com/vi/HSOtku1j600/maxresdefault.jpg',
          'Fevereiro 2025',
          'C',
          true
        );
      `);
      console.log('✅ Test videos inserted');
    } else {
      console.log(`ℹ️  Table already has ${count} videos, skipping test data`);
    }

    // Verify
    const result = await client.query(`
      SELECT id, title_pt, position, active
      FROM featured_videos
      ORDER BY position
    `);

    console.log('\n📺 Current videos:');
    result.rows.forEach(row => {
      console.log(`  [${row.position || '-'}] ${row.title_pt} (ID: ${row.id}, Active: ${row.active})`);
    });

    console.log('\n✅ Migration completed successfully!\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(err => {
  console.error(err);
  process.exit(1);
});
