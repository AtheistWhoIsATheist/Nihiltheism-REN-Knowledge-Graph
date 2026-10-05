# PowerShell Launcher for Nihiltheism REN Knowledge Graph
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting Nihiltheism REN Knowledge Graph & ROAE System   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js was not found in PATH. Please install Node.js (v18+) from https://nodejs.org/"
    exit 1
}

# Check for npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Error "npm was not found in PATH. Please ensure Node.js is properly installed."
    exit 1
}

# Check node_modules
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "node_modules directory missing. Running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting development server on http://localhost:3000 ..." -ForegroundColor Green
npm run dev
