#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " Starting Nihiltheism REN Knowledge Graph & ROAE System   "
echo "=========================================================="

# Check for node
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH."
    echo "Please install Node.js (version 18 or newer) to continue."
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed or not in PATH."
    exit 1
fi

# Install dependencies if node_modules is missing
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Installing dependencies..."
    npm install
fi

echo "Launching application server on http://localhost:3000 ..."
npm run dev
