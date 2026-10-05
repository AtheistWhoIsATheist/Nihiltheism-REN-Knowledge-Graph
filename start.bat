@echo off
setlocal enabledelayedexpansion

echo ==========================================================
echo  Starting Nihiltheism REN Knowledge Graph ^& ROAE System  
echo ==========================================================

REM Check for Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not found in PATH.
    echo Please install Node.js (v18 or higher) from https://nodejs.org/
    pause
    exit /b 1
)

REM Check for npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not found in PATH.
    pause
    exit /b 1
)

REM Install dependencies if node_modules missing
if not exist "node_modules\" (
    echo node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting development server on http://localhost:3000 ...
call npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo Application exited with code %ERRORLEVEL%.
    pause
)
