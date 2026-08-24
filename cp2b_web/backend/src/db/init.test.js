import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import defaultInit, { initializeDatabase } from './init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('initializeDatabase exports are defined and functions', () => {
  assert.equal(typeof initializeDatabase, 'function');
  assert.equal(typeof defaultInit, 'function');
  assert.equal(initializeDatabase, defaultInit);
});

test('schema.sql and migrations exist and are readable', () => {
  const schemaPath = path.join(__dirname, 'schema.sql');
  assert.ok(fs.existsSync(schemaPath), 'schema.sql must exist');
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  assert.ok(schemaContent.length > 0, 'schema.sql must not be empty');

  const migrationsDir = path.join(__dirname, 'migrations');
  assert.ok(fs.existsSync(migrationsDir), 'migrations directory must exist');
  const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
  assert.ok(migrationFiles.length > 0, 'at least one migration file must exist');

  // Verify all migration files are non-empty and readable
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    assert.ok(content.length > 0, `migration ${file} must not be empty`);
  }
});
