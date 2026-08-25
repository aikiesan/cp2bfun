-- Migration 038: remove former CP2b team members from the public directory
-- Safe to run once through the normal migration runner.

DELETE FROM team_members
WHERE LOWER(TRIM(name)) IN (
  LOWER('Marlon Fernandes de Souza'),
  LOWER('Gustavo Mockaitis')
);
