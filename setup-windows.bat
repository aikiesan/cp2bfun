@echo off
echo ========================================
echo CP2B Admin Dashboard - Quick Setup
echo ========================================
echo.

echo [1/5] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 20+ from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js: OK
node --version
echo.

echo [2/5] Checking PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: psql command not found
    echo Make sure PostgreSQL is installed and added to PATH
    echo Or use Docker: docker run --name cp2b-postgres -e POSTGRES_USER=cp2b -e POSTGRES_PASSWORD=cp2b -e POSTGRES_DB=cp2b -p 5432:5432 -d postgres:15
    echo.
) else (
    echo PostgreSQL: OK
    psql --version
    echo.
)

echo [3/5] Installing backend dependencies...
cd cp2b_web\backend
if not exist node_modules (
    echo Running npm install...
    call npm install
) else (
    echo Dependencies already installed
)
echo.

echo [4/5] Initializing database...
echo This will create tables and seed data...
call npm run db:init
if errorlevel 1 (
    echo.
    echo ERROR: Database initialization failed!
    echo.
    echo Make sure:
    echo - PostgreSQL is running
    echo - Database 'cp2b' exists
    echo - User 'cp2b' exists with password 'cp2b'
    echo.
    echo Quick fix:
    echo   psql -U postgres
    echo   CREATE DATABASE cp2b;
    echo   CREATE USER cp2b WITH PASSWORD 'cp2b';
    echo   GRANT ALL PRIVILEGES ON DATABASE cp2b TO cp2b;
    echo.
    pause
    exit /b 1
)
echo.

echo [5/5] Installing frontend dependencies...
cd ..\
if not exist node_modules (
    echo Running npm install...
    call npm install
) else (
    echo Dependencies already installed
)
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start Backend (in one terminal):
echo    cd cp2b_web\backend
echo    npm start
echo.
echo 2. Start Frontend (in another terminal):
echo    cd cp2b_web
echo    npm run dev
echo.
echo 3. Open browser:
echo    http://localhost:5175/admin/partners
echo.
echo Press any key to start backend now...
pause >nul

echo.
echo Starting backend server...
echo (Press Ctrl+C to stop)
echo.
npm start
